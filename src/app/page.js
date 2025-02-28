'use client';

import { useState, useEffect } from 'react';
import { FiArrowRight, FiShoppingBag, FiClock, FiShield } from 'react-icons/fi';
import Categories from "@/app/components/Categories";
import ProductList from "@/app/components/ProductList";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});

  // スクロールアニメーション用の効果
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.scroll-reveal');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.85) {
          section.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期表示時にも実行

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ヒーローセクション */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background z-0"></div>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">最新のトレンド</span>を<br />あなたの手元に
            </h1>
            <p className="text-muted text-lg mb-10 leading-relaxed">
              モダンなデザインと使いやすさを追求した、次世代のECサイトへようこそ。
              最新のファッションアイテムからテクノロジーまで、幅広い商品をご用意しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="/products" className="btn btn-primary px-8 py-4 text-lg shadow-lg shadow-primary/20">
                商品を見る
              </a>
              <a href="/about" className="btn px-8 py-4 text-lg border border-border hover:bg-secondary flex items-center group">
                詳細を見る
                <FiArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* カテゴリーセクション */}
      <section className="py-20 scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 inline-block relative">
              カテゴリー
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">お好みのカテゴリーから商品をお探しください</p>
          </div>
          <div className="mb-16">
            <Categories onSelectCategory={setSelectedCategory} />
          </div>
        </div>
      </section>
      
      {/* 商品セクション */}
      <section className="py-20 bg-secondary/50 scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 inline-block relative">
              おすすめ商品
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">人気の商品をピックアップしました</p>
          </div>
          <ProductList category={selectedCategory} />
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-24 scroll-reveal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 inline-block relative">
              当サイトの特徴
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">お客様に最高の体験をお届けします</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card p-8 bg-card hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FiShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">高品質な商品</h3>
              <p className="text-muted leading-relaxed">厳選された高品質な商品のみを取り扱っています。すべての商品は品質検査を通過しています。</p>
            </div>
            
            <div className="card p-8 bg-card hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FiClock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">迅速な配送</h3>
              <p className="text-muted leading-relaxed">ご注文から最短翌日にお届けします。配送状況はリアルタイムで確認できます。</p>
            </div>
            
            <div className="card p-8 bg-card hover:border-primary/20 group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FiShield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">安全な決済</h3>
              <p className="text-muted leading-relaxed">複数の決済方法に対応し、すべての取引は暗号化されています。安心してお買い物いただけます。</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTAセクション */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/10 to-background relative overflow-hidden scroll-reveal">
        <div className="absolute inset-0 bg-[url('/cta-pattern.svg')] opacity-10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              今すぐ<span className="gradient-text">ショッピング</span>を始めましょう
            </h2>
            <p className="text-muted text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              最新のトレンドアイテムを見つけて、あなたのライフスタイルをアップグレードしましょう。
              会員登録で特別なオファーやクーポンをお届けします。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/products" className="btn btn-primary px-8 py-4 text-lg shadow-lg shadow-primary/20">
                商品を見る
              </a>
              <a href="/register" className="btn px-8 py-4 text-lg border border-border hover:bg-secondary">
                会員登録
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
