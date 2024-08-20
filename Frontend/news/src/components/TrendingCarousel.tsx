"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMainStore } from '@/components/ArticleStore';
import parse from 'html-react-parser';

interface Category {
  category_name: string;
}

interface Article {
  news_id: string;
  category_id: string;
  news_title: string;
  content: string;
  posted_on: string;
  modified_on: string;
  cover_image: string;
  is_verified: boolean;
  is_rejected: boolean;
  Category: Category;
}

const ArticleLink: React.FC<{ article: Article, children: React.ReactNode }> = ({ article, children }) => {
  const send_article = useMainStore(state => state.setMainArticle);

  const handleClick = (e:React.MouseEvent) => {
    const article_content = article;
    if (article_content) {
      send_article(article_content);
    } else {
      console.log("No content found !");
    }
  }

  return (
    <Link href={`/main/newspage/${article.news_title}`} onClick={handleClick}>
      {children}
    </Link>
  );
};

const TrendingCarousel: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {articles.map((article, index) => (
        <ArticleLink article={article} key={index}>
          <div 
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } cursor-pointer`}
          >
            <div className="relative w-full h-full">
              <img
                src={article.cover_image}
                alt={article.news_title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
              <span className="inline-block bg-white text-black rounded-full px-3 py-1 text-sm font-semibold mb-2">
                {article.Category.category_name}
              </span>
              <h3 className="text-2xl font-semibold mb-2">{parse(article.news_title)}</h3>
              <p className="mb-2">{parse(article.content.substring(0, 150))}...</p>
              <p className="text-sm">Posted on: {article.posted_on}</p>
            </div>
          </div>
        </ArticleLink>
      ))}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default TrendingCarousel;