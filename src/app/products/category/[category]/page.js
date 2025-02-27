'use client';

import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;

  // カテゴリに応じた商品データを取得する処理をここに実装
  // 仮のデータを表示
  const products = [
    { id: 1, name: '商品A', price: 1000, category: 'a' },
    { id: 2, name: '商品B', price: 2000, category: 'b' },
    { id: 3, name: '商品C', price: 3000, category: 'c' },
  ].filter(product => product.category === category);

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-2xl font-bold mb-6">
        カテゴリ「{category.toUpperCase()}」の商品一覧
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div 
            key={product.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600">¥{product.price.toLocaleString()}</p>
          </div>
        ))}
        
        {products.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            このカテゴリの商品は現在ありません。
          </p>
        )}
      </div>
    </div>
  );
}
