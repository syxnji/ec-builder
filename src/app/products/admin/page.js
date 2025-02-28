'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // 商品を削除
  const deleteProduct = async (id) => {
    if (!confirm('この商品を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('商品の削除に失敗しました');
      }

      // 商品リストを更新
      fetchProducts();
    } catch (err) {
      console.error('商品の削除エラー:', err);
      alert('商品の削除に失敗しました。後でもう一度お試しください。');
    }
  };

  // コンポーネントがマウントされたときに商品データを取得
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <Link 
          href="/products/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> 新規商品
        </Link>
      </div>

      {loading ? (
        <p className="text-center py-4 text-gray-800">読み込み中...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            再試行
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 mb-4">商品がありません</p>
          <Link 
            href="/products/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center"
          >
            <FaPlus className="mr-2" /> 最初の商品を追加
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-gray-800">ID</th>
                <th className="py-2 px-4 border-b text-left text-gray-800">商品名</th>
                <th className="py-2 px-4 border-b text-left text-gray-800">価格</th>
                <th className="py-2 px-4 border-b text-left text-gray-800">在庫</th>
                <th className="py-2 px-4 border-b text-left text-gray-800">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-gray-800">{product.id}</td>
                  <td className="py-2 px-4 border-b text-gray-800">{product.name}</td>
                  <td className="py-2 px-4 border-b text-gray-800">¥{product.price.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b text-gray-800">{product.stock}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/products/${product.id}/edit`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FaEdit />
                      </Link>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 