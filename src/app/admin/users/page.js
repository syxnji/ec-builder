'use client';

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiSearch } from 'react-icons/fi';

export default function UsersAdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ダミーデータを使用
  useEffect(() => {
    // 実際の実装では、APIからユーザーデータを取得します
    const dummyUsers = [
      { id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'user', createdAt: '2023-01-15' },
      { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'user', createdAt: '2023-02-20' },
      { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'admin', createdAt: '2023-01-05' },
      { id: 4, name: '田中誠', email: 'tanaka@example.com', role: 'user', createdAt: '2023-03-10' },
      { id: 5, name: '伊藤めぐみ', email: 'ito@example.com', role: 'user', createdAt: '2023-02-28' },
    ];
    
    setTimeout(() => {
      setUsers(dummyUsers);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteUser = (userId) => {
    // 実際の実装では、APIを呼び出してユーザーを削除します
    if (confirm('このユーザーを削除してもよろしいですか？')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ユーザー管理</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <FiUserPlus />
          <span>新規ユーザー</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{user.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted">
                      ユーザーが見つかりませんでした
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