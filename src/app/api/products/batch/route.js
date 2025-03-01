import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '有効な商品IDリストが必要です' },
        { status: 400 }
      );
    }

    // 数値に変換
    const productIds = ids.map(id => typeof id === 'string' ? parseInt(id) : id).filter(id => !isNaN(id));

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: '有効な商品IDが含まれていません' },
        { status: 400 }
      );
    }

    // 指定されたIDの商品を取得
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    // 見つからない商品IDがあるかチェック
    const foundIds = products.map(p => p.id);
    const missingIds = productIds.filter(id => !foundIds.includes(id));
    
    if (missingIds.length > 0) {
      console.warn(`存在しない商品ID: ${missingIds.join(', ')}`);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('商品の一括取得に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の一括取得に失敗しました: ' + error.message },
      { status: 500 }
    );
  }
} 