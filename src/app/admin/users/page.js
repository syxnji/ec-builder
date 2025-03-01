'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiSearch, FiX, FiCheck, FiRefreshCw, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function UsersAdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  // ユーザー一覧を取得
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // セッションがロード中または存在しない場合は早期リターン
      if (status === 'loading' || !session) {
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/users/admin', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザー一覧の取得に失敗しました');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('ユーザー一覧の取得エラー:', error);
      toast.error(error.message || 'ユーザー一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (status !== 'loading') {
      fetchUsers();
    }
  }, [status, session]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteUser = async (userId) => {
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      try {
        const response = await fetch(`/api/users/admin?id=${userId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('ユーザーの削除に失敗しました');
        }
        
        toast.success('ユーザーを削除しました');
        fetchUsers(); // ユーザー一覧を再取得
      } catch (error) {
        console.error('ユーザー削除エラー:', error);
        toast.error('ユーザーの削除に失敗しました');
      }
    }
  };
  
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // パスワードは空にする
      role: user.role
    });
    setIsModalOpen(true);
  };
  
  const handleAddNewUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user'
    });
    setIsModalOpen(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingUser) {
        // ユーザー更新
        const updateData = {
          id: editingUser.id,
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        
        // パスワードが入力されている場合のみ含める
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        response = await fetch('/api/users/admin', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updateData)
        });
      } else {
        // 新規ユーザー作成
        response = await fetch('/api/users/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ユーザーの保存に失敗しました');
      }
      
      toast.success(editingUser ? 'ユーザーを更新しました' : 'ユーザーを作成しました');
      setIsModalOpen(false);
      fetchUsers(); // ユーザー一覧を再取得
    } catch (error) {
      console.error('ユーザー保存エラー:', error);
      toast.error(error.message || 'ユーザーの保存に失敗しました');
    }
  };
  
  // 日付をフォーマット
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">ユーザー管理</h1>
          <div className="flex space-x-3">
            <button 
              className="btn bg-white text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              onClick={handleAddNewUser}
            >
              <FiUserPlus />
              <span>新規ユーザー</span>
            </button>
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 transition-all duration-300"
              onClick={fetchUsers}
            >
              <FiRefreshCw />
              <span>更新</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-muted" />
          </div>
          <input
            type="text"
            className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-2.5"
            placeholder="ユーザー名またはメールアドレスで検索..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">名前</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">メールアドレス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">権限</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">注文数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">登録日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted/10 text-muted'
                        }`}>
                          {user.role === 'admin' ? '管理者' : 'ユーザー'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user._count?.order || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={() => handleEditUser(user)}
                            title="編集"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            onClick={() => handleDeleteUser(user.id)}
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
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-muted">
                      ユーザーが見つかりませんでした
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ユーザー作成/編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingUser ? 'ユーザーを編集' : '新規ユーザーを作成'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">名前</label>
                  <input
                    type="text"
                    name="name"
                    className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                    placeholder="ユーザー名を入力"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">メールアドレス</label>
                  <input
                    type="email"
                    name="email"
                    className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                    placeholder="メールアドレスを入力"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    パスワード {editingUser && <span className="text-xs text-muted">(変更する場合のみ入力)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                    placeholder={editingUser ? '新しいパスワードを入力' : 'パスワードを入力'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">権限</label>
                  <select
                    name="role"
                    className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="user">ユーザー</option>
                    <option value="admin">管理者</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-muted/20 hover:bg-muted/30 text-foreground rounded-lg transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiSave />
                  {editingUser ? '更新' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 