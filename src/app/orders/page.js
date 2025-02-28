'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ログイン状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders');
    }
  }, [status, router]);

  // 注文履歴を取得
  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('注文履歴の取得に失敗しました');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('注文履歴の取得エラー:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // ログインしていない場合は何も表示しない（useEffectでリダイレクト）
  if (status === 'unauthenticated') {
    return null;
  }

  // エラーがある場合
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">注文履歴</h1>
      
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiPackage size={48} className="text-muted" />
          </div>
          <h2 className="text-xl font-semibold mb-2">注文履歴がありません</h2>
          <p className="text-muted mb-6">まだ注文がありません。商品を購入してみましょう。</p>
          <Link href="/products" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <FiArrowLeft className="mr-2" /> 商品一覧に戻る
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="bg-secondary p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted">注文番号: {order.id}</p>
                  <p className="text-sm text-muted">注文日: {new Date(order.createdAt).toLocaleDateString('ja-JP')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">¥{order.totalAmount.toLocaleString()}</p>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-3">注文商品</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-border pb-3">
                      <div className="w-12 h-12 bg-secondary rounded-md overflow-hidden mr-3">
                        {item.product?.imageUrl && (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || '商品情報なし'}</h4>
                        <p className="text-sm text-muted">数量: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">¥{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 