import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

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

    let orders;
    
    // 管理者の場合は全ての注文を取得、一般ユーザーの場合は自分の注文のみ取得
    if (user.role === 'admin') {
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          orderitem: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      });
    } else {
      // 一般ユーザーの場合は自分の注文のみ取得
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          orderitem: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('注文履歴の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '注文履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 注文ステータスを更新するエンドポイント
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

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

    // 管理者権限チェック
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: '注文IDとステータスは必須です' },
        { status: 400 }
      );
    }

    // 有効なステータス値をチェック
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: '無効なステータス値です' },
        { status: 400 }
      );
    }

    // 注文ステータスを更新
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('注文ステータスの更新に失敗しました:', error);
    return NextResponse.json(
      { error: '注文ステータスの更新に失敗しました' },
      { status: 500 }
    );
  }
} 