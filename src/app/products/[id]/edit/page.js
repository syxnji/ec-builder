'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 商品データを取得
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('商品が見つかりません');
          }
          throw new Error('商品データの取得に失敗しました');
        }
        
        const product = await response.json();
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          stock: product.stock.toString(),
          imageUrl: product.imageUrl || ''
        });
        setError(null);
      } catch (err) {
        console.error('商品データの取得エラー:', err);
        setError(err.message || '商品データの取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // フォーム入力の変更を処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // フォーム送信を処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 基本的なバリデーション
    if (!formData.name.trim()) {
      setError('商品名は必須です');
      return;
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError('有効な価格を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '商品の更新に失敗しました');
      }

      // 成功したら商品一覧ページにリダイレクト
      router.push('/products');
    } catch (err) {
      console.error('商品更新エラー:', err);
      setError(err.message || '商品の更新に失敗しました。後でもう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-800">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link 
            href="/products" 
            className="text-blue-500 hover:text-blue-700"
          >
            ← 商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">商品編集</h1>
          <Link 
            href="/products" 
            className="text-blue-500 hover:text-blue-700"
          >
            ← 商品一覧に戻る
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              商品名 *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="商品名"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              商品説明
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="商品の説明"
              rows="4"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              価格 (円) *
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="価格"
              min="0"
              step="1"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
              在庫数
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="在庫数"
              min="0"
              step="1"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
              商品画像URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={saving}
            >
              {saving ? '保存中...' : '変更を保存'}
            </button>
            <Link
              href="/products"
              className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 