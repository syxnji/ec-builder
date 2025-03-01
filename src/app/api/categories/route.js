import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 全てのカテゴリーを取得
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('カテゴリーの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリーの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 新しいカテゴリーを作成
export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    // 必須フィールドの検証
    if (!name) {
      return NextResponse.json(
        { error: 'カテゴリー名は必須です' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('カテゴリーの作成に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリーの作成に失敗しました' },
      { status: 500 }
    );
  }
} 