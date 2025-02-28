'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ダミーデータを使用
  useEffect(() => {
    // 実際の実装では、APIから商品データを取得します
    const dummyProducts = [
      { 
        id: 1, 
        name: 'プレミアムTシャツ', 
        price: 3500, 
        stock: 25, 
        category: 'アパレル',
        image: 'https://placehold.co/100x100/png',
        createdAt: '2023-01-10' 
      },
      { 
        id: 2, 
        name: 'ワイヤレスイヤホン', 
        price: 12800, 
        stock: 10, 
        category: '電子機器',
        image: 'https://placehold.co/100x100/png',
        createdAt: '2023-02-15' 
      },
      { 
        id: 3, 
        name: 'デザイナーバッグ', 
        price: 25000, 
        stock: 5, 
        category: 'アクセサリー',
        image: 'https://placehold.co/100x100/png',
        createdAt: '2023-01-20' 
      },
      { 
        id: 4, 
        name: 'スマートウォッチ', 
        price: 18500, 
        stock: 15, 
        category: '電子機器',
        image: 'https://placehold.co/100x100/png',
        createdAt: '2023-03-05' 
      },
      { 
        id: 5, 
        name: 'オーガニックコーヒー', 
        price: 1200, 
        stock: 50, 
        category: '食品',
        image: 'https://placehold.co/100x100/png',
        createdAt: '2023-02-25' 
      },
    ];
    
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteProduct = (productId) => {
    // 実際の実装では、APIを呼び出して商品を削除します
    if (confirm('この商品を削除してもよろしいですか？')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">商品管理</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <FiPlus />
          <span>新規商品</span>
        </button>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-muted" />
          </div>
          <input
            type="text"
            className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-2.5"
            placeholder="商品名またはカテゴリで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">画像</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">商品名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">価格</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">在庫</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">カテゴリ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">登録日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' : 
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{product.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/products/${product.id}`} className="text-green-500 hover:text-green-700">
                            <FiEye size={18} />
                          </Link>
                          <button className="text-blue-500 hover:text-blue-700">
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-muted">
                      商品が見つかりませんでした
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 