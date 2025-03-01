'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiPackage, FiLogOut, FiSettings, FiHome, FiGrid, FiInfo } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/app/context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { getCartItemsCount } = useCart();
  const userMenuRef = useRef(null);

  const user = session?.user;
  const isAuthenticated = status === 'authenticated';
  const isAdmin = user?.role === 'admin';

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ユーザーメニューの外側をクリックしたときに閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <nav className={`bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">モダンEC</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2">
              <FiHome className="transition-transform group-hover:scale-110" />
              <span>ホーム</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2">
              <FiGrid className="transition-transform group-hover:scale-110" />
              <span>商品一覧</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2">
              <FiInfo className="transition-transform group-hover:scale-110" />
              <span>会社概要</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {user && (
              <>
                <Link href="/orders" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2">
                  <FiPackage className="transition-transform group-hover:scale-110" />
                  <span>注文履歴</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2"
                >
                  <FiLogOut className="transition-transform group-hover:scale-110" />
                  <span>ログアウト</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
              </>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" className="text-foreground hover:text-primary transition-colors flex items-center gap-1 group relative py-2">
                  <FiSettings className="transition-transform group-hover:scale-110" />
                  <span>管理者</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>
            
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="text-foreground hover:text-primary transition-colors relative group">
              <div className="p-2 rounded-full bg-secondary/80 group-hover:bg-primary/10 transition-colors">
                <FiShoppingCart size={20} />
              </div>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {getCartItemsCount()}
              </span>
            </Link>
            
            {!user ? (
              <Link href="/login" className="text-foreground hover:text-primary transition-colors flex items-center group">
                <div className="p-2 rounded-full bg-secondary/80 group-hover:bg-primary/10 transition-colors">
                  <FiUser size={20} />
                </div>
                <span className="ml-2 hidden md:inline group-hover:underline">ログイン</span>
              </Link>
            ) : (
              <div className="relative group" ref={userMenuRef}>
                <div 
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* ユーザードロップダウンメニュー */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-fadeIn">
                    <div className="p-3 border-b border-border bg-secondary/30">
                      <p className="font-medium text-sm">{user.name || 'ユーザー'}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 hover:text-primary transition-colors">
                        <FiPackage size={16} />
                        <span>注文履歴</span>
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 hover:text-primary transition-colors">
                          <FiSettings size={16} />
                          <span>管理者画面</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary/50 hover:text-primary transition-colors w-full text-left"
                      >
                        <FiLogOut size={16} />
                        <span>ログアウト</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary md:hidden focus:outline-none p-2 rounded-full bg-secondary/80 hover:bg-primary/10 transition-colors"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border mt-4 animate-fadeIn">
            <Link href="/" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              <FiHome /> ホーム
            </Link>
            <Link href="/products" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              <FiGrid /> 商品一覧
            </Link>
            <Link href="/about" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
              <FiInfo /> 会社概要
            </Link>
            {user && (
              <>
                <Link href="/orders" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
                  <FiPackage /> 注文履歴
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-3 px-4 w-full text-left text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  <FiLogOut /> ログアウト
                </button>
              </>
            )}
            {isAdmin && (
              <>
                <Link href="/admin" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
                  <FiSettings /> 管理者ページ
                </Link>
                <Link href="/products/admin" className="flex items-center gap-2 py-3 px-4 text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-colors">
                  <FiPackage /> 商品管理
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
} 