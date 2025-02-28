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

    // 合計金額を計算
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // トランザクションを使用して在庫を更新し、注文を作成
    const result = await prisma.$transaction(async (prisma) => {
      // 注文を作成
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount,
          status: 'completed',
          orderItems: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          orderItems: true
        }
      });

      // 在庫を更新
      await Promise.all(
        items.map(item => {
          return prisma.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        })
      );

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
      { error: 'チェックアウト処理に失敗しました' },
      { status: 500 }
    );
  }
} 