"use client";
 
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useMainStore } from '@/components/ArticleStore';
import parse from 'html-react-parser';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { apiLinks } from '@/utils/constants';
import Image from 'next/image';
 
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
 
interface latestnewsProps {
  articles_: Article[];
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
 
const ArticleSkeleton: React.FC = () => (
  <div className="flex-none w-full">
    <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 flex-grow">
        <Skeleton className="h-6 w-24 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);
 
const LatestNewsCarousel: React.FC<latestnewsProps> = ({articles_}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleArticles, setVisibleArticles] = useState(8); // 2 rows of 4 articles each
  const articlesPerRow = 4;
 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(apiLinks.newsletter.verifiedArticles);
        const data = await response.json();
        setArticles(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
      }
    };
 
    fetchArticles();
  }, []);
 
  const loadMoreArticles = () => {
    setVisibleArticles(prevVisible => prevVisible + articlesPerRow);
  };
 
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array(8).fill(0).map((_, index) => <ArticleSkeleton key={index} />)
          : articles.slice(0, visibleArticles).map((article, index) => (
            <div key={index} className="flex-none w-full">
              <ArticleLink article={article}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col cursor-pointer hover:shadow-xl hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="relative h-48">
                    <Image
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
      {!isLoading && visibleArticles < articles.length && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreArticles}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-6"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
};
 
export default LatestNewsCarousel;