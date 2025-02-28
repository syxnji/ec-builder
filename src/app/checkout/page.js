'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cartItems, clearCart, getCartTotal, isLoaded } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  // ログイン状態をチェック
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/checkout');
    }
  }, [status, router]);

  if (status === 'loading' || !isLoaded) {
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

  // カートが空の場合はカートページにリダイレクト
  if (cartItems.length === 0 && !isComplete) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 在庫を減らすAPIを呼び出す
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '注文処理中にエラーが発生しました');
      }

      // 注文完了
      setIsComplete(true);
      clearCart();
    } catch (err) {
      console.error('チェックアウトエラー:', err);
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-4">注文完了</h1>
          <p className="text-muted mb-6">ご注文ありがとうございました。</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">注文確認</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">注文内容</h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-border pb-4">
                  <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden mr-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && <p className="text-sm text-muted">{item.variant}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{item.price.toLocaleString()}</p>
                    <p className="text-sm text-muted">数量: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">注文サマリー</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted">小計</span>
                <span>¥{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">送料</span>
                <span>¥0</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>合計</span>
                <span>¥{getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  処理中...
                </>
              ) : (
                '注文を確定する'
              )}
            </button>
            
            <Link 
              href="/cart" 
              className="w-full mt-3 border border-border py-3 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <FiArrowLeft className="mr-2" /> カートに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 