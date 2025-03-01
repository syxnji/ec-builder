'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiEye, FiX, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [previewImage, setPreviewImage] = useState('');
  
  // 商品データの取得
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('商品の取得に失敗しました');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('商品の取得エラー:', error);
      setError('商品の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  // カテゴリデータの取得
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('カテゴリの取得に失敗しました');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('カテゴリの取得エラー:', error);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  // カテゴリ名を取得する関数
  const getCategoryName = (categoryId) => {
    if (!categoryId && categoryId !== 0) return '-';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '-';
  };
  
  // 商品のフィルタリングとソート
  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedCategory === '' || product.categoryId === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'stock') {
        return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else {
        // デフォルトは日付でソート
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt) 
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  const handleDeleteProduct = async (productId) => {
    if (confirm('この商品を削除してもよろしいですか？')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('商品の削除に失敗しました');
        }
        
        setSuccess('商品が正常に削除されました');
        fetchProducts(); // 商品リストを更新
      } catch (error) {
        console.error('商品の削除エラー:', error);
        setError('商品の削除に失敗しました');
      }
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId || ''
    });
    setPreviewImage(product.imageUrl || '');
    setShowModal(true);
  };
  
  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      imageUrl: '',
      categoryId: ''
    });
    setPreviewImage('');
    setShowModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'imageUrl' && value) {
      setPreviewImage(value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}` 
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: formData.categoryId || null
        }),
      });
      
      if (!response.ok) {
        throw new Error(editingProduct ? '商品の更新に失敗しました' : '商品の作成に失敗しました');
      }
      
      setSuccess(editingProduct ? '商品が正常に更新されました' : '商品が正常に作成されました');
      setShowModal(false);
      fetchProducts(); // 商品リストを更新
    } catch (error) {
      console.error('商品の保存エラー:', error);
      setError(error.message);
    }
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">商品管理</h1>
          <div className="flex space-x-3">
            <button 
              className="btn bg-white text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              onClick={handleNewProduct}
            >
              <FiPlus />
              <span>新規商品</span>
            </button>
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 transition-all duration-300"
              onClick={fetchProducts}
            >
              <FiRefreshCw />
              <span>更新</span>
            </button>
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 transition-all duration-300"
            >
              <FiDownload />
              <span>エクスポート</span>
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex justify-between items-center shadow-md animate-fadeIn">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 transition-colors">
            <FiX size={20} />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 flex justify-between items-center shadow-md animate-fadeIn">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 transition-colors">
            <FiX size={20} />
          </button>
        </div>
      )}
      
      <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-muted" />
            </div>
            <input
              type="text"
              className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              placeholder="商品名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiFilter className="text-muted" />
            </div>
            <select
              className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.7 }}></div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">画像</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('name')}>
                    <div className="flex items-center">
                      <span>商品名</span>
                      <span className="ml-1">{getSortIcon('name')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('price')}>
                    <div className="flex items-center">
                      <span>価格</span>
                      <span className="ml-1">{getSortIcon('price')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('stock')}>
                    <div className="flex items-center">
                      <span>在庫</span>
                      <span className="ml-1">{getSortIcon('stock')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">カテゴリ</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSortChange('createdAt')}>
                    <div className="flex items-center">
                      <span>登録日</span>
                      <span className="ml-1">{getSortIcon('createdAt')}</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative group">
                          <img 
                            src={product.imageUrl || 'https://placehold.co/100x100/png'} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-border shadow-sm group-hover:scale-105 transition-transform duration-200" 
                          />
                          {product.imageUrl && (
                            <div className="absolute opacity-0 group-hover:opacity-100 -top-2 -right-2 bg-white rounded-full p-1 shadow-md transition-opacity duration-200">
                              <a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-700">
                                <FiEye size={14} />
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getCategoryName(product.categoryId) !== '-' ? (
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-xs font-medium">
                            {getCategoryName(product.categoryId)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(product.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <Link href={`/products/${product.id}`} className="text-green-500 hover:text-green-700 bg-green-100 p-2 rounded-full hover:bg-green-200 transition-colors duration-200">
                            <FiEye size={18} />
                          </Link>
                          <button 
                            className="text-indigo-500 hover:text-indigo-700 bg-indigo-100 p-2 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors duration-200"
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
                    <td colSpan={8} className="px-6 py-12 text-center text-muted">
                      <div className="flex flex-col items-center">
                        <svg className="h-16 w-16 text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">商品が見つかりませんでした</p>
                        <p className="text-sm mt-1">検索条件を変更するか、新しい商品を追加してください</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* 商品作成/編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-card rounded-xl shadow-2xl p-6 w-full max-w-3xl border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {editingProduct ? '商品を編集' : '新規商品を作成'}
              </h2>
              <button 
                className="text-muted hover:text-foreground bg-muted/10 hover:bg-muted/20 rounded-full p-2 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-foreground">商品名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    required
                    placeholder="商品名を入力してください"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-foreground">説明</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    rows={4}
                    placeholder="商品の説明を入力してください"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">価格</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-muted">¥</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-8 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">在庫数</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">カテゴリ</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">カテゴリなし</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">画像URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {/* 画像プレビュー */}
                <div className="md:col-span-2 flex justify-center">
                  {previewImage ? (
                    <div className="relative group">
                      <img 
                        src={previewImage} 
                        alt="プレビュー" 
                        className="h-48 object-contain rounded-lg border border-border shadow-sm" 
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => {
                          setPreviewImage('');
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                      <div className="text-center text-muted">
                        <p>画像URLを入力すると、ここにプレビューが表示されます</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  className="px-6 py-3 border border-border rounded-lg hover:bg-muted/10 transition-colors duration-200"
                  onClick={() => setShowModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  {editingProduct ? '更新する' : '作成する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 