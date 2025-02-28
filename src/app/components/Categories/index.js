'use client';

import { useState, useEffect } from 'react';
import { FiGrid, FiTag } from 'react-icons/fi';

export default function Categories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('カテゴリーデータの取得に失敗しました');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('カテゴリーデータの取得エラー:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-0 w-full h-full border-3 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-3 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-sm p-4 bg-red-50 rounded-lg">
        <p>カテゴリーの読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`
          flex items-center gap-2 px-5 py-3 rounded-full 
          transition-all duration-300 shadow-sm
          ${activeCategory === null 
            ? 'bg-primary text-white shadow-primary/20' 
            : 'bg-secondary hover:bg-primary/10 text-foreground'}
        `}
      >
        <FiGrid className={`${activeCategory === null ? 'animate-pulse' : ''}`} />
        <span>すべて</span>
      </button>
      
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-full 
            transition-all duration-300 shadow-sm
            animate-fadeIn
            ${activeCategory === category.id 
              ? 'bg-primary text-white shadow-primary/20' 
              : 'bg-secondary hover:bg-primary/10 text-foreground'}
          `}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <FiTag className={`${activeCategory === category.id ? 'animate-pulse' : ''}`} />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
}