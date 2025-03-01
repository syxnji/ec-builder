import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 特定のカテゴリを取得
export async function GET(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    // IDを整数に変換
    const categoryId = parseInt(id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: '無効なID形式です' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// カテゴリを更新
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    // IDを整数に変換
    const categoryId = parseInt(id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: '無効なID形式です' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // カテゴリの存在確認
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    // カテゴリを更新
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name !== undefined ? name : existingCategory.name
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('カテゴリの更新に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// カテゴリを削除
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    // IDを整数に変換
    const categoryId = parseInt(id, 10);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: '無効なID形式です' },
        { status: 400 }
      );
    }

    // カテゴリの存在確認
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'カテゴリが見つかりません' },
        { status: 404 }
      );
    }

    // 関連する商品の確認
    const productsCount = await prisma.product.count({
      where: { categoryId: categoryId }
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'このカテゴリに関連する商品があるため削除できません' },
        { status: 400 }
      );
    }

    // カテゴリを削除
    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ message: 'カテゴリが正常に削除されました' });
  } catch (error) {
    console.error('カテゴリの削除に失敗しました:', error);
    return NextResponse.json(
      { error: 'カテゴリの削除に失敗しました' },
      { status: 500 }
    );
  }
} 