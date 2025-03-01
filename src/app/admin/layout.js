'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FiUsers, FiPackage, FiShoppingBag, FiSettings, FiHome, 
  FiMenu, FiX, FiList, FiShoppingCart, FiLogOut, 
  FiBell, FiSearch, FiHelpCircle, FiUser, FiBarChart2
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: '新規注文', message: '新しい注文が入りました', time: '5分前', read: false },
    { id: 2, title: '在庫アラート', message: '商品「スマートフォンX」の在庫が残り3点です', time: '1時間前', read: false },
    { id: 3, title: 'システム通知', message: 'システムメンテナンスが予定されています', time: '昨日', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 一時的に認証チェックを無効化
  /*
  useEffect(() => {
    // ローディングが終了し、ユーザーが存在しないか管理者でない場合はリダイレクト
    if (status !== 'loading') {
      if (!session) {
        router.push('/login?redirect=/admin');
      } else if (session.user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [session, status, router]);

  // 認証中の場合はローディング表示
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  */

  const adminNavItems = [
    { name: 'ダッシュボード', href: '/admin', icon: <FiHome size={18} /> },
    { name: '商品管理', href: '/admin/products', icon: <FiPackage size={18} /> },
    { name: 'カテゴリ管理', href: '/admin/categories', icon: <FiList size={18} /> },
    { name: '注文管理', href: '/admin/orders', icon: <FiShoppingCart size={18} /> },
    { name: 'ユーザー管理', href: '/admin/users', icon: <FiUsers size={18} /> },
    { name: '分析', href: '/admin/analytics', icon: <FiBarChart2 size={18} /> },
    { name: '設定', href: '/admin/settings', icon: <FiSettings size={18} /> },
  ];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* モバイルサイドバートグルボタン */}
      <button
        className="fixed bottom-4 right-4 z-50 md:hidden bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* デスクトップサイドバー */}
      <div className={`hidden md:flex flex-col w-64 bg-card border-r border-border transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            モダンEC管理
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted hover:text-primary transition-colors"
          >
            <FiMenu size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-muted" />
            </div>
            <input
              type="text"
              placeholder="検索..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              メインメニュー
            </h3>
            <ul className="space-y-1">
              {adminNavItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              システム
            </h3>
            <ul className="space-y-1">
              {adminNavItems.slice(5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <FiUser size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">管理者</p>
              <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
            </div>
            <FiLogOut className="text-muted-foreground hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* モバイルサイドバー */}
      <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-64 h-full bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                モダンEC管理
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-muted hover:text-primary transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-muted" />
              </div>
              <input
                type="text"
                placeholder="検索..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <nav className="p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                メインメニュー
              </h3>
              <ul className="space-y-1">
                {adminNavItems.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                システム
              </h3>
              <ul className="space-y-1">
                {adminNavItems.slice(5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <span className="text-primary">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          
          <div className="p-4 border-t border-border mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <FiUser size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">管理者</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
              <FiLogOut className="text-muted-foreground hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-card border-b border-border h-16 flex items-center px-6 sticky top-0 z-10">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 text-muted-foreground hover:text-primary transition-colors hidden md:block"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="text-lg font-medium md:hidden">モダンEC管理</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* ヘルプボタン */}
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-secondary/50">
                <FiHelpCircle size={20} />
              </button>
              
              {/* 通知ボタン */}
              <div className="relative">
                <button 
                  className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-secondary/50"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FiBell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                
                {/* 通知ドロップダウン */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
                    <div className="p-3 border-b border-border flex justify-between items-center">
                      <h3 className="font-medium">通知</h3>
                      <button className="text-xs text-primary hover:underline">すべて既読にする</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-3 hover:bg-secondary/50 cursor-pointer ${notification.read ? '' : 'bg-primary/5'}`}
                              onClick={() => handleNotificationClick(notification.id)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          通知はありません
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-border text-center">
                      <button className="text-sm text-primary hover:underline">すべての通知を見る</button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* ユーザーメニュー */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 hover:bg-secondary/50 p-2 rounded-lg transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <FiUser size={16} />
                  </div>
                  <span className="hidden md:block text-sm font-medium">管理者</span>
                </button>
                
                {/* ユーザードロップダウン */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50">
                    <div className="p-3 border-b border-border">
                      <p className="font-medium">管理者</p>
                      <p className="text-xs text-muted-foreground">admin@example.com</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left p-2 text-sm hover:bg-secondary/50 rounded-md flex items-center gap-2">
                        <FiUser size={16} className="text-primary" />
                        <span>プロフィール</span>
                      </button>
                      <button className="w-full text-left p-2 text-sm hover:bg-secondary/50 rounded-md flex items-center gap-2">
                        <FiSettings size={16} className="text-primary" />
                        <span>設定</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-border">
                      <button className="w-full text-left p-2 text-sm hover:bg-secondary/50 rounded-md flex items-center gap-2 text-red-500">
                        <FiLogOut size={16} />
                        <span>ログアウト</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      
      {/* クリックアウトハンドラー */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
} 