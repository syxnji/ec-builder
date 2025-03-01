const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 管理者アカウントの作成
  console.log('管理者アカウントを作成中...');
  const admin = await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@mail.com',
      password: '$2b$10$czyYILoTPk7W0/uKQ28nt.IY5hMSE9c4MbhQpMXoaGJxQ01h2ZZwK',
      role: 'admin'
    }
  });
  console.log(`管理者アカウントが作成されました: ${admin.email}`);

  // カテゴリーデータの作成
  const categories = [
    { name: 'キーボード' },
    { name: 'マウス' },
    { name: 'ヘッドセット' },
    { name: 'マウスパッド' },
    { name: 'パッド' },
  ];

  console.log('カテゴリーデータを作成中...');
  const createdCategories = [];
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });
    createdCategories.push(createdCategory);
  }

  // 商品データの作成
  const products = [
    {
      name: 'キーボード A',
      price: 3000,
      description: 'キーボード Aの説明文です。',
      stock: 10,
      imageUrl: '/images/keyboard (1).jfif',
      categoryId: createdCategories[0].id,
    },
    {
      name: 'キーボード B',
      price: 3000,
      description: 'キーボード Bの説明文です。',
      stock: 10,
      imageUrl: '/images/keyboard (2).jfif',
      categoryId: createdCategories[0].id,
    },
    {
      name: 'マウス A',
      price: 2000,
      description: 'マウス Aの説明文です。',
      stock: 5,
      imageUrl: '/images/mouse (1).jfif',
      categoryId: createdCategories[1].id,
    },
    {
      name: 'マウス B ',
      price: 2000,
      description: 'マウス Bの説明文です。',
      stock: 5,
      imageUrl: '/images/mouse (2).jfif',
      categoryId: createdCategories[1].id,
    },
    {
      name: 'ヘッドセット A',
      price: 3000,
      description: 'ヘッドセット Aの説明文です。',
      stock: 8,
      imageUrl: '/images/headset (1).jfif',
      categoryId: createdCategories[2].id,
    },
    {
      name: 'ヘッドセット B',
      price: 3000,
      description: 'ヘッドセット Bの説明文です。',
      stock: 8,
      imageUrl: '/images/headset (2).jfif',
      categoryId: createdCategories[2].id,
    },
    {
      name: 'マウスパッド A',
      price: 4000,
      description: 'マウスパッド Aの説明文です。',
      stock: 3,
      imageUrl: '/images/mousepad (1).jfif',
      categoryId: createdCategories[3].id,
    },
    {
      name: 'マウスパッド B',
      price: 4000,
      description: 'マウスパッド Bの説明文です。',
      stock: 3,
      imageUrl: '/images/mousepad (2).jfif',
      categoryId: createdCategories[3].id,
    },
    {
      name: 'パッド A',
      price: 5000,
      description: 'パッド Aの説明文です。',
      stock: 12,
      imageUrl: '/images/pad (1).jfif',
      categoryId: createdCategories[4].id,
    },
    {
      name: 'パッド B',
      price: 5000,
      description: 'パッド Bの説明文です。',
      stock: 12,
      imageUrl: '/images/pad (2).jfif',
      categoryId: createdCategories[4].id,
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