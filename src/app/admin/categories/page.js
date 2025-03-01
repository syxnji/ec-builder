'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // カテゴリデータの取得
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('カテゴリの取得に失敗しました');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('カテゴリの取得エラー:', error);
      setError('カテゴリの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteCategory = async (categoryId) => {
    if (confirm('このカテゴリを削除してもよろしいですか？関連する商品がある場合は削除できません。')) {
      try {
        // IDが文字列の場合は整数に変換
        const id = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
        
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'カテゴリの削除に失敗しました');
        }
        
        setSuccess('カテゴリが正常に削除されました');
        fetchCategories(); // カテゴリリストを更新
      } catch (error) {
        console.error('カテゴリの削除エラー:', error);
        setError(error.message);
      }
    }
  };
  
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name
    });
    setShowModal(true);
  };
  
  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({
      id: '',
      name: ''
    });
    setShowModal(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (editingCategory) {
        // カテゴリの更新
        // IDが文字列の場合は整数に変換
        const categoryId = typeof editingCategory.id === 'string' ? parseInt(editingCategory.id, 10) : editingCategory.id;
        
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: formData.name }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'カテゴリの更新に失敗しました');
        }
        
        setSuccess('カテゴリが更新されました');
      } else {
        // 新規カテゴリの作成
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'カテゴリの作成に失敗しました');
        }
        
        setSuccess('新しいカテゴリが作成されました');
      }
      
      setShowModal(false);
      fetchCategories(); // カテゴリリストを更新
    } catch (error) {
      console.error('カテゴリの保存エラー:', error);
      setError(error.message);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">カテゴリ管理</h1>
          <div className="flex space-x-3">
            <button 
              className="btn bg-white text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              onClick={handleNewCategory}
            >
              <FiPlus />
              <span>新規カテゴリ</span>
            </button>
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 transition-all duration-300"
              onClick={fetchCategories}
            >
              <FiRefreshCw />
              <span>更新</span>
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
      
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-muted" />
          </div>
          <input
            type="text"
            className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-2.5"
            placeholder="カテゴリ名またはIDで検索..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">カテゴリ名</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">登録日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{category.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(category.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={() => handleEditCategory(category)}
                            title="編集"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="削除"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted">
                      カテゴリが見つかりませんでした
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* カテゴリ作成/編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'カテゴリを編集' : '新規カテゴリを作成'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted mb-1">カテゴリ名</label>
                <input
                  type="text"
                  name="name"
                  className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                  placeholder="カテゴリ名を入力"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-muted/20 hover:bg-muted/30 text-foreground rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiSave />
                  {editingCategory ? '更新' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 