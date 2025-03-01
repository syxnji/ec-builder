import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 全ての商品を取得
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('商品の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 新しい商品を作成
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId } = body;

    // 必須フィールドの検証
    if (!name || !price) {
      return NextResponse.json(
        { error: '商品名と価格は必須です' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        imageUrl,
        categoryId: categoryId ? parseInt(categoryId) : null
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('商品の作成に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の作成に失敗しました' },
      { status: 500 }
    );
  }
} 