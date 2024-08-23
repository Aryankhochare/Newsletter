'use client'
import React, { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { useMainStore } from './ArticleStore';
import Link from 'next/link';
import parse from 'html-react-parser';
import { parseISO, format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
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

interface TrendingCarouselProps {
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


const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ articles_ }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(apiLinks.newsletter.verifiedArticles);
        const data = await response.json();
        setArticles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles_.length) % articles_.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles_.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] overflow-hidden">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }


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
              <Image
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-fit"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
              <span className="inline-block bg-white text-black rounded-full px-3 py-1 text-sm font-semibold mb-2">
                {article.categoryName}
              </span>
              <h3 className="text-2xl font-semibold mb-2">{parse(article.title)}</h3>
               <div className="mb-2">{parse(article.editorContent.substring(0, 150))}...</div>
              <p className="text-sm">Published: {format(parseISO(article.postedOn),'dd-MMM-yyyy')}</p>
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