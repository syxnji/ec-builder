'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiFilter } from 'react-icons/fi';

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // ダミーデータを使用
  useEffect(() => {
    // 実際の実装では、APIから注文データを取得します
    const dummyOrders = [
      { 
        id: 'ORD-2023-001', 
        customer: '山田太郎', 
        email: 'yamada@example.com',
        total: 15800, 
        status: 'completed', 
        items: 3,
        date: '2023-03-15' 
      },
      { 
        id: 'ORD-2023-002', 
        customer: '佐藤花子', 
        email: 'sato@example.com',
        total: 8500, 
        status: 'processing', 
        items: 2,
        date: '2023-03-16' 
      },
      { 
        id: 'ORD-2023-003', 
        customer: '鈴木一郎', 
        email: 'suzuki@example.com',
        total: 25000, 
        status: 'shipped', 
        items: 1,
        date: '2023-03-17' 
      },
      { 
        id: 'ORD-2023-004', 
        customer: '田中誠', 
        email: 'tanaka@example.com',
        total: 12300, 
        status: 'cancelled', 
        items: 4,
        date: '2023-03-18' 
      },
      { 
        id: 'ORD-2023-005', 
        customer: '伊藤めぐみ', 
        email: 'ito@example.com',
        total: 5600, 
        status: 'pending', 
        items: 2,
        date: '2023-03-19' 
      },
    ];
    
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 500);
  }, []);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed':
        return '完了';
      case 'processing':
        return '処理中';
      case 'shipped':
        return '発送済み';
      case 'cancelled':
        return 'キャンセル';
      case 'pending':
        return '保留中';
      default:
        return status;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">注文管理</h1>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-muted" />
            </div>
            <input
              type="text"
              className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-2.5"
              placeholder="注文ID、顧客名、メールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiFilter className="text-muted" />
            </div>
            <select
              className="bg-background border border-border text-foreground rounded-lg block w-full pl-10 p-2.5"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">すべてのステータス</option>
              <option value="pending">保留中</option>
              <option value="processing">処理中</option>
              <option value="shipped">発送済み</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">注文ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">顧客</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">メールアドレス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">商品数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">合計金額</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ステータス</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">注文日</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/10">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700">
                            <FiEye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-muted">
                      注文が見つかりませんでした
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