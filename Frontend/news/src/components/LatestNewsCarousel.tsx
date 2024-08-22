"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useMainStore } from '@/components/ArticleStore';
import parse from 'html-react-parser';
import {format, parseISO , formatDistanceToNow} from 'date-fns'

interface Article {
  id: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  editorContent: string;
  postedOn: string;
  modifiedOn: string;
  isVerified: boolean;
  coverImage: string;
  isRejected: boolean;
}

const ArticleLink: React.FC<{ article: Article, children: React.ReactNode }> = ({ article, children }) => {
  const send_article = useMainStore(state => state.setMainArticle);

  const handleClick = (e: React.MouseEvent) => {
    const article_content = article;
    if (article_content) {
      send_article(article_content);
    } else {
      console.log("No content found !");
    }
  }

  return (
    <Link href={`/main/newspage/${article.title}`} onClick={handleClick}>
      {children}
    </Link>
  );
};

const LatestNewsCarousel: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://globalbuzz.azurewebsites.net/newsletter/verified');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <div key={index} className="flex-none  w-full">
          <ArticleLink article={article}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col cursor-pointer hover:shadow-xl hover:transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-48">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-fit"
                />
              </div>
              <div className="p-4 flex-grow">
                <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mb-2">
                  {article.categoryName}
                </span>
                <h3 className="text-xl font-semibold mb-2">{parse(article.title)}</h3>
                <div className="mb-2">{parse(article.editorContent.substring(0, 150))}...</div>
                <p className="text-sm text-gray-500 mt-auto">Published: {formatDistanceToNow(parseISO(article.postedOn))} ago</p>
              </div>
            </div>
          </ArticleLink>
        </div>
      ))}
    </div>
  );
};

export default LatestNewsCarousel;
