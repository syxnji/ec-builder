'use client';

// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./context/CartContext";
import { FiMail, FiPhone, FiMapPin, FiHeart, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <title>モダンECサイト</title>
        <meta name="description" content="最新のデザインを取り入れたECサイト" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-4">
              {children}
            </main>
            <footer className="bg-gradient-to-br from-secondary to-secondary/30 py-16 mt-16 border-t border-border relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/footer-pattern.svg')] opacity-5 z-0"></div>
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="md:col-span-1">
                    <div className="text-2xl font-bold mb-6 relative inline-block">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">モダンEC</span>
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent"></span>
                    </div>
                    <p className="text-muted mb-6 leading-relaxed">
                      最新のデザインを取り入れた<br />モダンなECサイトです。<br />
                      お客様に最高のショッピング体験をお届けします。
                    </p>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <FiTwitter />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <FiFacebook />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                        <FiInstagram />
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-6 relative inline-block">
                      リンク
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/30"></span>
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="/" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          ホーム
                        </a>
                      </li>
                      <li>
                        <a href="/products" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          商品一覧
                        </a>
                      </li>
                      <li>
                        <a href="/about" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          会社概要
                        </a>
                      </li>
                      <li>
                        <a href="/contact" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          お問い合わせ
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-6 relative inline-block">
                      カテゴリー
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/30"></span>
                    </h3>
                    <ul className="space-y-3">
                      <li>
                        <a href="/products?category=1" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          ファッション
                        </a>
                      </li>
                      <li>
                        <a href="/products?category=2" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          エレクトロニクス
                        </a>
                      </li>
                      <li>
                        <a href="/products?category=3" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          ホーム＆キッチン
                        </a>
                      </li>
                      <li>
                        <a href="/products?category=4" className="text-muted hover:text-primary transition-colors flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                          ビューティー
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-6 relative inline-block">
                      お問い合わせ
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/30"></span>
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <FiMapPin />
                        </div>
                        <span className="text-muted">〒123-4567<br />東京都渋谷区〇〇 1-2-3</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <FiPhone />
                        </div>
                        <a href="tel:03-1234-5678" className="text-muted hover:text-primary transition-colors">03-1234-5678</a>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <FiMail />
                        </div>
                        <a href="mailto:info@example.com" className="text-muted hover:text-primary transition-colors">info@example.com</a>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2023 モダンECサイト All rights reserved.</p>
                    <div className="flex items-center gap-6">
                      <a href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">プライバシーポリシー</a>
                      <a href="/terms" className="text-sm text-muted hover:text-primary transition-colors">利用規約</a>
                      <a href="/faq" className="text-sm text-muted hover:text-primary transition-colors">よくある質問</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
            <Toaster position="top-right" toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }} />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
