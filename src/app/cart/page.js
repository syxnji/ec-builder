'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    isLoaded 
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">ショッピングカート</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiShoppingBag size={48} className="text-muted" />
          </div>
          <h2 className="text-xl font-semibold mb-2">カートは空です</h2>
          <p className="text-muted mb-6">商品をカートに追加してください</p>
          <Link href="/products" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            <FiArrowLeft className="mr-2" /> 商品一覧に戻る
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left p-4">商品</th>
                    <th className="text-center p-4">価格</th>
                    <th className="text-center p-4">数量</th>
                    <th className="text-center p-4">小計</th>
                    <th className="text-center p-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden mr-4">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.variant && <p className="text-sm text-muted">{item.variant}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">¥{item.price.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-l-md hover:bg-secondary"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 border-y border-border text-center focus:outline-none"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-r-md hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              
              <Link 
                href="/checkout" 
                className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                レジに進む
              </Link>
              
              <Link 
                href="/products" 
                className="w-full mt-3 border border-border py-3 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <FiArrowLeft className="mr-2" /> ショッピングを続ける
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 