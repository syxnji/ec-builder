import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: '有効な商品リストが必要です' },
        { status: 400 }
      );
    }

    // ユーザーがログインしているか確認
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    // ユーザーIDを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 在庫チェック
    const productIds = items.map(item => item.id);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    // 在庫不足の商品をチェック
    const insufficientStockItems = [];
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `商品ID ${item.id} が見つかりません` },
          { status: 404 }
        );
      }
      
      if (product.stock < item.quantity) {
        insufficientStockItems.push({
          id: product.id,
          name: product.name,
          requestedQuantity: item.quantity,
          availableStock: product.stock
        });
      }
    }

    // 在庫不足の商品がある場合はエラーを返す
    if (insufficientStockItems.length > 0) {
      return NextResponse.json(
        { 
          error: '在庫が不足している商品があります',
          insufficientStockItems 
        },
        { status: 400 }
      );
    }

    // 合計金額を計算
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // トランザクションを使用して在庫を更新し、注文を作成
    const result = await prisma.$transaction(async (tx) => {
      // 注文を作成
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: 'completed',
          orderitem: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          orderitem: true
        }
      });

      // 在庫を更新
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    return NextResponse.json({ 
      success: true, 
      message: '注文が完了しました',
      order: result
    });
  } catch (error) {
    console.error('チェックアウト処理に失敗しました:', error);
    return NextResponse.json(
      { error: 'チェックアウト処理に失敗しました: ' + error.message },
      { status: 500 }
    );
  }
} 