const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // カテゴリーデータの作成
  const categories = [
    { id: 'A', name: 'カテゴリーA' },
    { id: 'B', name: 'カテゴリーB' },
    { id: 'C', name: 'カテゴリーC' },
    { id: 'D', name: 'カテゴリーD' },
  ];

  console.log('カテゴリーデータを作成中...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // 商品データの作成
  const products = [
    {
      name: '商品1',
      price: 1000,
      description: '商品1の説明文です。',
      stock: 10,
      imageUrl: 'https://placehold.jp/300x250.png',
      categoryId: 'A',
    },
    {
      name: '商品2',
      price: 2000,
      description: '商品2の説明文です。',
      stock: 5,
      imageUrl: 'https://placehold.jp/3d4070/ffffff/300x250.png?text=商品2',
      categoryId: 'B',
    },
    {
      name: '商品3',
      price: 3000,
      description: '商品3の説明文です。',
      stock: 8,
      imageUrl: 'https://placehold.jp/e83a3a/ffffff/300x250.png?text=商品3',
      categoryId: 'C',
    },
    {
      name: '商品4',
      price: 4000,
      description: '商品4の説明文です。',
      stock: 3,
      imageUrl: 'https://placehold.jp/27ae60/ffffff/300x250.png?text=商品4',
      categoryId: 'D',
    },
  ];

  console.log('商品データを作成中...');
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('シードデータの作成が完了しました');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 