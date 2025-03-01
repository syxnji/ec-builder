import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 特定の商品を取得
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('商品の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 商品を更新
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, price, stock, imageUrl, categoryId } = body;

    // 商品の存在確認
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    // 商品を更新
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        categoryId: categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : existingProduct.categoryId
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('商品の更新に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 商品を削除
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }

    // 商品の存在確認
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: '商品が見つかりません' },
        { status: 404 }
      );
    }

    // 商品を削除
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: '商品が正常に削除されました' });
  } catch (error) {
    console.error('商品の削除に失敗しました:', error);
    return NextResponse.json(
      { error: '商品の削除に失敗しました' },
      { status: 500 }
    );
  }
} 