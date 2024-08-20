"use client";

import React from 'react';
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

const LatestNewsCarousel: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (scrollOffset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="relative">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {articles.map((article, index) => (
          <div key={index} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3">
            <ArticleLink article={article}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col cursor-pointer">
                <div className="relative h-48">
                  <img
                    src={article.cover_image}
                    alt={article.news_title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mb-2">
                    {article.Category.category_name}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{parse(article.news_title)}</h3>
                  <div className="mb-2">{parse(article.content.substring(0, 150))}...</div>
                  <p className="text-sm text-gray-500 mt-auto">Posted on: {article.posted_on}</p>
                </div>
              </div>
            </ArticleLink>
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll(-300)}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll(300)}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LatestNewsCarousel;