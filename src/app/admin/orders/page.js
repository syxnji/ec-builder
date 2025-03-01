'use client';

import { useState, useEffect } from 'react';
import { FiEye, FiSearch, FiFilter, FiEdit, FiCheck, FiRefreshCw, FiSave, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function OrdersAdminPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [error, setError] = useState('');
  
  // 注文一覧を取得
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      // セッションがロード中または存在しない場合は早期リターン
      if (status === 'loading') {
        console.log('セッションロード中...');
        setLoading(false);
        return;
      }
      
      if (!session) {
        console.log('セッションが存在しません');
        setError('ログインが必要です');
        setLoading(false);
        return;
      }
      
      console.log('セッション情報:', session);
      
      const response = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('APIレスポンスステータス:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('APIエラーレスポンス:', errorData);
        setError(errorData.error || '注文一覧の取得に失敗しました');
        throw new Error(errorData.error || '注文一覧の取得に失敗しました');
      }
      
      const data = await response.json();
      console.log('取得した注文データ:', data);
      setOrders(data);
    } catch (error) {
      console.error('注文一覧の取得エラー:', error);
      setError(error.message || '注文一覧の取得に失敗しました');
      toast.error(error.message || '注文一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (status !== 'loading') {
      fetchOrders();
    }
  }, [status, session]);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm.toLowerCase()) || 
      (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'delivered':
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
      case 'delivered':
        return '配達済み';
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
  
  // 注文ステータスの編集モーダルを開く
  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setIsModalOpen(true);
  };
  
  // 注文ステータスを更新
  const handleUpdateStatus = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId: selectedOrder.id,
          status: editStatus
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '注文ステータスの更新に失敗しました');
      }
      
      toast.success('注文ステータスを更新しました');
      setIsModalOpen(false);
      fetchOrders(); // 注文一覧を再取得
    } catch (error) {
      console.error('注文ステータス更新エラー:', error);
      toast.error(error.message || '注文ステータスの更新に失敗しました');
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
  
  // 注文の詳細を表示
  const handleViewOrderDetails = (order) => {
    // 注文詳細ページに遷移するか、モーダルで詳細を表示する実装
    console.log('注文詳細を表示:', order);
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">注文管理</h1>
          <div className="flex space-x-3">
            <button 
              className="btn bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 transition-all duration-300"
              onClick={fetchOrders}
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
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md animate-fadeIn">
          <p><strong>エラー:</strong> {error}</p>
          <p className="text-sm mt-1">セッション状態: {status}</p>
          {session && (
            <p className="text-sm">ログインユーザー: {session.user?.email} (ロール: {session.user?.role || '不明'})</p>
          )}
          <button 
            onClick={fetchOrders} 
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded text-sm flex items-center gap-1"
          >
            <FiRefreshCw size={14} />
            再試行
          </button>
        </div>
      )}
      
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
              <option value="delivered">配達済み</option>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.user?.name || '未登録ユーザー'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.user?.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.orderItems?.length || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatPrice(order.totalAmount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={() => handleEditStatus(order)}
                            title="ステータス変更"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            onClick={() => handleViewOrderDetails(order)}
                            title="詳細を表示"
                          >
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
      
      {/* 注文ステータス編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">注文ステータスを更新</h2>
            
            <div className="mb-4">
              <p className="text-sm text-muted mb-2">注文 #{selectedOrder.id}</p>
              <p className="mb-1"><span className="font-medium">顧客:</span> {selectedOrder.user?.name || '未登録ユーザー'}</p>
              <p className="mb-1"><span className="font-medium">合計金額:</span> {formatPrice(selectedOrder.totalAmount)}</p>
              <p><span className="font-medium">注文日:</span> {formatDate(selectedOrder.createdAt)}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted mb-1">ステータス</label>
              <select
                className="bg-background border border-border text-foreground rounded-lg block w-full p-2.5"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="pending">保留中</option>
                <option value="processing">処理中</option>
                <option value="shipped">発送済み</option>
                <option value="delivered">配達済み</option>
                <option value="cancelled">キャンセル</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-muted/20 hover:bg-muted/30 text-foreground rounded-lg transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2"
                onClick={handleUpdateStatus}
              >
                <FiSave />
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 