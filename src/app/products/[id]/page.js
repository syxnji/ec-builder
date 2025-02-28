'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/app/context/CartContext';

// 仮の商品データ（実際のアプリケーションではAPIから取得します）
const products = [
  {
    id: 1,
    name: '商品1',
    price: 1000,
    image: '/images/product1.jpg',
    category: 'A',
    description: '商品1の説明文です。これは商品の詳細な説明です。この商品の特徴や利点について説明しています。',
    stock: 10
  },
  {
    id: 2,
    name: '商品2',
    price: 2000,
    image: '/images/product2.jpg',
    category: 'B',
    description: '商品2の説明文です。これは商品の詳細な説明です。この商品の特徴や利点について説明しています。',
    stock: 5
  },
  {
    id: 3,
    name: '商品3',
    price: 3000,
    image: '/images/product3.jpg',
    category: 'C',
    description: '商品3の説明文です。これは商品の詳細な説明です。この商品の特徴や利点について説明しています。',
    stock: 8
  },
  {
    id: 4,
    name: '商品4',
    price: 4000,
    image: '/images/product4.jpg',
    category: 'D',
    description: '商品4の説明文です。これは商品の詳細な説明です。この商品の特徴や利点について説明しています。',
    stock: 3
  },
];

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">商品が見つかりませんでした</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          トップページに戻る
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000); // 3秒後に通知を消す
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← トップページに戻る
      </Link>
      
      {addedToCart && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{product.name}を{quantity}個カートに追加しました！</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="md:w-1/2 relative h-96 bg-gray-200 rounded-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/vercel.svg'; // フォールバック画像
            }}
          />
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-700 mb-4">¥{product.price.toLocaleString()}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">カテゴリー: {product.category}</p>
            <p className="text-sm text-gray-500">在庫: {product.stock}個</p>
          </div>
          
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4">数量:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            カートに追加
          </button>
        </div>
      </div>
    </div>
  );
} 