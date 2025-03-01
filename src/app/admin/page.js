'use client';

import { useState } from 'react';
import { FiUsers, FiPackage, FiShoppingBag, FiSettings, FiTrendingUp, FiDollarSign, FiShoppingCart, FiCalendar, FiAlertCircle, FiEye } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// サンプルデータ
const salesData = [
  { name: '1月', 売上: 420000 },
  { name: '2月', 売上: 380000 },
  { name: '3月', 売上: 510000 },
  { name: '4月', 売上: 490000 },
  { name: '5月', 売上: 530000 },
  { name: '6月', 売上: 590000 },
];

const productData = [
  { name: 'スマートフォン', value: 35 },
  { name: 'ノートPC', value: 25 },
  { name: 'タブレット', value: 20 },
  { name: 'アクセサリー', value: 15 },
  { name: 'その他', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const recentOrders = [
  { id: 'ORD-1234', customer: '田中太郎', date: '2023-02-28', amount: '¥12,800', status: '発送済み' },
  { id: 'ORD-1233', customer: '佐藤花子', date: '2023-02-27', amount: '¥8,500', status: '処理中' },
  { id: 'ORD-1232', customer: '鈴木一郎', date: '2023-02-27', amount: '¥23,400', status: '支払済み' },
  { id: 'ORD-1231', customer: '山田健太', date: '2023-02-26', amount: '¥5,600', status: '発送済み' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">ストアの最新情報とパフォーマンスを確認できます</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg flex items-center gap-2 transition-colors">
            <FiCalendar />
            <span>レポート生成</span>
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <FiEye />
            <span>ストア表示</span>
          </button>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            概要
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            分析
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            注文
          </button>
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {/* KPIカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">総売上</p>
                  <h3 className="text-3xl font-bold mt-2">¥1,234,567</h3>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <FiTrendingUp className="mr-1" />
                      +12.5%
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">先月比</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FiDollarSign className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData.slice(-4)}>
                    <Line type="monotone" dataKey="売上" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">注文数</p>
                  <h3 className="text-3xl font-bold mt-2">156</h3>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <FiTrendingUp className="mr-1" />
                      +8.2%
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">先月比</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FiShoppingCart className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: '1月', 値: 120 },
                    { name: '2月', 値: 135 },
                    { name: '3月', 値: 145 },
                    { name: '4月', 値: 156 },
                  ]}>
                    <Line type="monotone" dataKey="値" stroke="#00C49F" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">ユーザー数</p>
                  <h3 className="text-3xl font-bold mt-2">2,543</h3>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <FiTrendingUp className="mr-1" />
                      +5.3%
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">先月比</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FiUsers className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: '1月', 値: 2350 },
                    { name: '2月', 値: 2410 },
                    { name: '3月', 値: 2480 },
                    { name: '4月', 値: 2543 },
                  ]}>
                    <Line type="monotone" dataKey="値" stroke="#0088FE" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">コンバージョン率</p>
                  <h3 className="text-3xl font-bold mt-2">3.6%</h3>
                  <div className="flex items-center mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <FiTrendingUp className="mr-1 transform rotate-180" />
                      -0.8%
                    </span>
                    <span className="text-muted-foreground text-xs ml-2">先月比</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <FiTrendingUp className="text-primary text-xl" />
                </div>
              </div>
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: '1月', 値: 4.2 },
                    { name: '2月', 値: 4.0 },
                    { name: '3月', 値: 3.8 },
                    { name: '4月', 値: 3.6 },
                  ]}>
                    <Line type="monotone" dataKey="値" stroke="#FF8042" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* チャートとテーブル */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">月間売上推移</h3>
                <select className="bg-background border border-border rounded-md px-3 py-1 text-sm">
                  <option>過去6ヶ月</option>
                  <option>過去12ヶ月</option>
                  <option>今年</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value)}
                      labelFormatter={(label) => `${label}の売上`}
                    />
                    <Bar dataKey="売上" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">商品カテゴリ別売上</h3>
                <button className="text-primary text-sm hover:underline">詳細</button>
              </div>
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <ul className="space-y-2">
                  {productData.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 最近の注文 */}
          <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">最近の注文</h3>
              <a href="/admin/orders" className="text-primary text-sm hover:underline">すべて表示</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">注文ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">顧客名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">日付</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">金額</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ステータス</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">アクション</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === '発送済み' ? 'bg-green-100 text-green-800' :
                          order.status === '処理中' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-primary hover:underline">
                        <a href={`/admin/orders/${order.id}`}>詳細</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* クイックアクセス */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <FiUsers className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">ユーザー管理</h3>
                  <p className="text-muted-foreground text-sm">ユーザーの管理と権限設定</p>
                </div>
              </div>
              <a href="/admin/users" className="text-primary hover:underline text-sm flex items-center group">
                管理ページへ
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <FiPackage className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">商品管理</h3>
                  <p className="text-muted-foreground text-sm">商品の追加、編集、削除</p>
                </div>
              </div>
              <a href="/admin/products" className="text-primary hover:underline text-sm flex items-center group">
                管理ページへ
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <FiShoppingBag className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">注文管理</h3>
                  <p className="text-muted-foreground text-sm">注文の確認と処理</p>
                </div>
              </div>
              <a href="/admin/orders" className="text-primary hover:underline text-sm flex items-center group">
                管理ページへ
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <FiSettings className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">サイト設定</h3>
                  <p className="text-muted-foreground text-sm">サイト全体の設定管理</p>
                </div>
              </div>
              <a href="/admin/settings" className="text-primary hover:underline text-sm flex items-center group">
                管理ページへ
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-4">詳細な分析データ</h3>
            <p className="text-muted-foreground">このセクションでは詳細な分析データを表示します。</p>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold mb-4">注文管理</h3>
            <p className="text-muted-foreground">このセクションでは注文の詳細管理を行います。</p>
          </div>
        </div>
      )}

      {/* アラート通知 */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-card p-4 rounded-xl shadow-lg border border-border flex items-start gap-3 max-w-sm animate-in slide-in-from-right">
          <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
            <FiAlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-medium">在庫アラート</h4>
            <p className="text-sm text-muted-foreground mt-1">3つの商品が在庫切れ間近です。確認してください。</p>
            <div className="mt-2 flex gap-2">
              <button className="text-xs text-primary hover:underline">確認する</button>
              <button className="text-xs text-muted-foreground hover:underline">後で</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 