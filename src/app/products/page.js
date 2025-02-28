'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Categories from "@/app/components/Categories";
import { FaSearch } from 'react-icons/fa';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 商品データを取得
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('商品データの取得に失敗しました');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('商品データの取得エラー:', err);
      setError('商品データの取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // コンポーネントがマウントされたときに商品データを取得
  useEffect(() => {
    fetchProducts();
  }, []);

  // 商品をフィルタリング
  const filteredProducts = products
    .filter(product => 
      // カテゴリーでフィルタリング
      (selectedCategory ? product.categoryId === selectedCategory : true) &&
      // 検索クエリでフィルタリング
      (searchQuery 
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true)
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">商品一覧</h1>
      
      {/* 検索バー */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="商品を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* カテゴリーフィルター */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">カテゴリー</h2>
        <Categories onSelectCategory={setSelectedCategory} />
      </div>

      {/* 商品リスト */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded text-center">
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            再試行
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 mb-4">商品が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="relative w-full h-48 mb-4 bg-gray-200">
                  <Image
                    src={product.imageUrl || '/vercel.svg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '/vercel.svg'; // フォールバック画像
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-800 mb-2">¥{product.price.toLocaleString()}</p>
                <p className="text-gray-700 text-sm mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 0 ? '在庫あり' : '在庫なし'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 