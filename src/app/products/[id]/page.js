'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id);
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // APIから商品データを取得
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('商品データの取得に失敗しました');
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('商品データの取得エラー:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">商品が見つかりませんでした</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/products" className="text-blue-500 hover:underline">
          商品一覧に戻る
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
      <Link href="/products" className="text-blue-500 hover:underline mb-4 inline-block">
        ← 商品一覧に戻る
      </Link>
      
      {addedToCart && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{product.name}を{quantity}個カートに追加しました！</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <div className="md:w-1/2 relative h-96 bg-gray-200 rounded-lg">
          <Image
            src={product.imageUrl || '/vercel.svg'}
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
            <p className="text-sm text-gray-500">在庫: {product.stock}個</p>
          </div>
          
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4">数量:</label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border rounded px-2 py-1"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? (
                [...Array(Math.min(10, product.stock)).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))
              ) : (
                <option value={0}>0</option>
              )}
            </select>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'カートに追加' : '在庫切れ'}
          </button>
        </div>
      </div>
    </div>
  );
} 