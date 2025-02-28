'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiUsers, FiPackage, FiShoppingBag, FiSettings, FiHome, FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const adminMenuItems = [
    { name: 'ダッシュボード', href: '/admin', icon: <FiHome /> },
    { name: 'ユーザー管理', href: '/admin/users', icon: <FiUsers /> },
    { name: '商品管理', href: '/admin/products', icon: <FiPackage /> },
    { name: '注文管理', href: '/admin/orders', icon: <FiShoppingBag /> },
    { name: 'サイト設定', href: '/admin/settings', icon: <FiSettings /> },
  ];

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
      <div className={`hidden md:block w-64 bg-card border-r border-border transition-all duration-300 ${isSidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
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
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {adminMenuItems.map((item) => (
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
        </nav>
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
          <nav className="p-4">
            <ul className="space-y-2">
              {adminMenuItems.map((item) => (
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
          </nav>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 