"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from "next/link";
import { useMainStore } from '@/components/ArticleStore';
import parse from 'html-react-parser';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { apiLinks } from '@/utils/constants';

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
  // const [articles, setArticles] = useState<Article[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     try {
  //       const response = await fetch(apiLinks.newsletter.verifiedArticles);
  //       const data = await response.json();
  //       setArticles(data);
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching articles:', error);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchArticles();
  // }, []);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const articlesPerPage = 10;
  const observer = useRef<IntersectionObserver | null>(null);

  const lastArticleRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiLinks.newsletter.verifiedArticles);
      const data = await response.json();
      setAllArticles(data);
      setDisplayedArticles(data.slice(0, articlesPerPage));
      setHasMore(data.length > articlesPerPage);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const newArticles = allArticles.slice(startIndex, endIndex);
    setDisplayedArticles(prevArticles => [...prevArticles, ...newArticles]);
    setHasMore(endIndex < allArticles.length);
  }, [page, allArticles]);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayedArticles.map((article, index) => (
        <div 
          key={article.id} 
          className="flex-none w-full"
          ref={index === displayedArticles.length - 1 ? lastArticleRef : null}
        >
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
      {isLoading && Array(4).fill(0).map((_, index) => <ArticleSkeleton key={index} />)}
      {!hasMore && <p className="col-span-full text-center mt-4">No more articles to load</p>}
    </div>
  );
};

export default LatestNewsCarousel;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {isLoading
//         ? Array(8).fill(0).map((_, index) => <ArticleSkeleton key={index} />)
//         : articles.map((article, index) => (
//           <div key={index} className="flex-none w-full">
//             <ArticleLink article={article}>
//               <div className="bg-white rounded-lg overflow-hidden shadow-lg h-full flex flex-col cursor-pointer hover:shadow-xl hover:transform hover:scale-105 transition-transform duration-300">
//                 <div className="relative h-48">
//                   <img
//                     src={article.coverImage}
//                     alt={article.title}
//                     className="w-full h-full object-fit"
//                   />
//                 </div>
//                 <div className="p-4 flex-grow">
//                   <span className="inline-block bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mb-2">
//                     {article.categoryName}
//                   </span>
//                   <h3 className="text-xl font-semibold mb-2">{parse(article.title)}</h3>
//                   <div className="mb-2">{parse(article.editorContent.substring(0, 150))}...</div>
//                   <p className="text-sm text-gray-500 mt-auto">Published: {formatDistanceToNow(parseISO(article.postedOn))} ago</p>
//                 </div>
//               </div>
//             </ArticleLink>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default LatestNewsCarousel;