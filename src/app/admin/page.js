'use client';

import { FiUsers, FiPackage, FiShoppingBag, FiSettings, FiTrendingUp, FiDollarSign, FiShoppingCart } from 'react-icons/fi';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">管理者ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm">総売上</p>
              <h3 className="text-2xl font-bold mt-1">¥1,234,567</h3>
              <p className="text-green-500 text-xs mt-1">+12.5% 先月比</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FiDollarSign className="text-primary text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm">注文数</p>
              <h3 className="text-2xl font-bold mt-1">156</h3>
              <p className="text-green-500 text-xs mt-1">+8.2% 先月比</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FiShoppingCart className="text-primary text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm">ユーザー数</p>
              <h3 className="text-2xl font-bold mt-1">2,543</h3>
              <p className="text-green-500 text-xs mt-1">+5.3% 先月比</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FiUsers className="text-primary text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-sm">コンバージョン率</p>
              <h3 className="text-2xl font-bold mt-1">3.6%</h3>
              <p className="text-red-500 text-xs mt-1">-0.8% 先月比</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FiTrendingUp className="text-primary text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FiUsers className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">ユーザー管理</h3>
              <p className="text-muted text-sm">ユーザーの管理と権限設定</p>
            </div>
          </div>
          <a href="/admin/users" className="text-primary hover:underline text-sm flex items-center">
            管理ページへ
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FiPackage className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">商品管理</h3>
              <p className="text-muted text-sm">商品の追加、編集、削除</p>
            </div>
          </div>
          <a href="/admin/products" className="text-primary hover:underline text-sm flex items-center">
            管理ページへ
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FiShoppingBag className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">注文管理</h3>
              <p className="text-muted text-sm">注文の確認と処理</p>
            </div>
          </div>
          <a href="/admin/orders" className="text-primary hover:underline text-sm flex items-center">
            管理ページへ
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <FiSettings className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">サイト設定</h3>
              <p className="text-muted text-sm">サイト全体の設定管理</p>
            </div>
          </div>
          <a href="/admin/settings" className="text-primary hover:underline text-sm flex items-center">
            管理ページへ
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
} 