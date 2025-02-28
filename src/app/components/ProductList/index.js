'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';

export default function ProductList({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('商品データの取得に失敗しました');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('商品データの取得エラー:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = category 
    ? products.filter(product => product.categoryId === category)
    : products;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 font-medium mb-2">エラーが発生しました</p>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-md"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center p-12 bg-secondary/50 rounded-lg border border-border">
        <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-xl font-medium mb-2">商品が見つかりませんでした</p>
        <p className="text-muted mb-6">別のカテゴリーを選択するか、後でもう一度お試しください</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors shadow-md"
        >
          すべての商品を表示
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.map((product, index) => (
        <div 
          key={product.id} 
          className="group animate-fadeIn" 
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Link href={`/products/${product.id}`}>
            <div className="card bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
              <div className="relative overflow-hidden">
                <div className="relative w-full h-64 bg-secondary/50 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={product.imageUrl || '/vercel.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = '/vercel.svg'; // フォールバック画像
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" aria-label="カートに追加">
                    <FiShoppingCart size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75" aria-label="お気に入りに追加">
                    <FiHeart size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150" aria-label="詳細を見る">
                    <FiEye size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xl font-semibold text-primary">¥{product.price.toLocaleString()}</p>
                  {product.oldPrice && (
                    <p className="text-sm text-muted line-through">¥{product.oldPrice.toLocaleString()}</p>
                  )}
                </div>
                <p className="text-muted text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted">
                      {product.stock > 0 ? `在庫: ${product.stock}点` : '在庫切れ'}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {product.category?.name || 'その他'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
} 