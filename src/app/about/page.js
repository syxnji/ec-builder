'use client';

import { motion } from 'framer-motion';
import { FiUsers, FiTarget, FiAward, FiTrendingUp } from 'react-icons/fi';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* ヒーローセクション */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">
          私たちについて
        </h1>
        <p className="text-lg text-muted max-w-3xl mx-auto">
          モダンECは、最新のテクノロジーとデザインを駆使して、お客様に最高のショッピング体験をお届けすることを使命としています。
        </p>
      </motion.div>

      {/* 会社概要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold mb-6">私たちのストーリー</h2>
          <p className="text-muted mb-4 leading-relaxed">
            2020年に設立されたモダンECは、従来のECサイトの課題を解決するために生まれました。使いにくいインターフェース、複雑な購入プロセス、魅力的でないデザイン—これらの問題を解決するために、私たちは最新のテクノロジーとデザイン思考を取り入れた新しいECプラットフォームを構築しました。
          </p>
          <p className="text-muted mb-4 leading-relaxed">
            創業以来、私たちは常にユーザー体験を最優先に考え、シンプルでありながら機能的で美しいECサイトを提供することに注力してきました。現在では、多くのお客様にご利用いただき、日本全国の皆様に高品質な商品をお届けしています。
          </p>
          <p className="text-muted leading-relaxed">
            私たちは技術革新を続け、常に進化するECプラットフォームを目指しています。お客様のフィードバックを大切にし、より良いサービスを提供するために日々努力しています。
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
        >
          <Image 
            src="/about-image.jpg" 
            alt="モダンECチーム" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-xl font-semibold">チームモダンEC</p>
            <p>東京オフィスにて、2023年</p>
          </div>
        </motion.div>
      </div>

      {/* ミッションとビジョン */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-card border border-border rounded-2xl p-8 mb-20 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FiTarget className="text-primary mr-2" size={24} />
              ミッション
            </h3>
            <p className="text-muted leading-relaxed">
              最新のテクノロジーとデザインを活用し、ユーザーフレンドリーで美しいECプラットフォームを提供することで、お客様のショッピング体験を向上させ、販売者と購入者の双方に価値を提供します。
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FiTrendingUp className="text-primary mr-2" size={24} />
              ビジョン
            </h3>
            <p className="text-muted leading-relaxed">
              日本で最も革新的で使いやすいECプラットフォームとなり、オンラインショッピングの新しい標準を確立します。テクノロジーの力で人々の生活を豊かにし、持続可能な消費社会の実現に貢献します。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 価値観 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-10 text-center">私たちの価値観</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FiUsers className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">お客様中心</h3>
            <p className="text-muted">
              すべての決定はお客様の満足度を最優先に考えます。使いやすさ、信頼性、サポート品質において妥協しません。
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FiAward className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">品質へのこだわり</h3>
            <p className="text-muted">
              提供する商品、サービス、そしてプラットフォーム自体において、常に最高品質を追求します。
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FiTrendingUp className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">革新と進化</h3>
            <p className="text-muted">
              テクノロジーとデザインの最前線に立ち、常に新しいアイデアを取り入れ、プラットフォームを進化させ続けます。
            </p>
          </div>
        </div>
      </motion.div>

      {/* お問い合わせCTA */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">お問い合わせ</h2>
        <p className="text-muted max-w-2xl mx-auto mb-6">
          モダンECについてさらに詳しく知りたい方、ご質問やご提案がある方は、お気軽にお問い合わせください。
        </p>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          お問い合わせフォーム
        </button>
      </motion.div>
    </div>
  );
} 