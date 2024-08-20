"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { supabase } from '@/app/api/auth/[...nextauth]/route';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMainStore } from '@/components/ArticleStore'; //Added this !
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import parse from 'html-react-parser'

// ... (keep all the interfaces and ArticleLink component as they are)




  interface Category {
    category_name: string;
  }
  
  interface Article {
    news_id : string; //Added this !
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
    const [userRole, setUserRole] = useState<string | null>(null);
    const send_article = useMainStore(state => state.setMainArticle);
  
    useEffect(() => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }, []);

    const handleClick = (e:React.MouseEvent) => {
      const article_content = article;
      if (article_content)
      {
        send_article(article_content);
      }
      else{
        console.log("No content found !");
      }
    }
  
    // if (userRole && userRole !== 'user') {
      return (
        <Link href={`/main/newspage/${article.news_title}`} onClick={handleClick}>
           {children}
         </Link>
      );
    // } else {
    //   return (
    //     <Dialog>
    //       <DialogTrigger asChild>
    //         {children}
    //       </DialogTrigger>
    //       <DialogContent>
    //         <DialogHeader>
    //           <DialogTitle>Login Required</DialogTitle>
    //         </DialogHeader>
    //         <p>Please login to continue reading this article.</p>
    //       </DialogContent>
    //     </Dialog>
    //  );
    //}
  };
  
    const TrendingCarousel: React.FC<{ articles: Article[] }> = ({ articles }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
      }, 6000);
  
      return () => clearInterval(timer);
    }, [articles.length]);
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
                // layout="fill"
                // objectFit="cover"
                className="w-full h-full object-cover"
                // quality={75}
              />
            </div>
            
            {/* trending news */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
              <span className="inline-block bg-white text-black rounded-full px-3 py-1 text-sm font-semibold mb-2">
                {article.Category.category_name}      {/*   category name   */}
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
  // ... (keep the TrendingCarousel component as it is)


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
        className="flex overflow-x-auto space-x-4 pb-4  scrollbar-hide  "
        style={{ scrollBehavior: 'smooth' }}
      >
        {articles.map((article, index) => (
          <div key={index} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 ">
            <ArticleLink article={article}>
              <div className="bg-white rounded-lg overflow-hidden  shadow-lg h-full flex flex-col cursor-pointer">
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
                  <p className="text-gray-600 mb-4">{parse(article.content.substring(0, 100))}...</p>
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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async() => {
    try {
      const {data, error} = await supabase.from('News').select(`
        *,
        Category (
          category_name
        )
      `).eq('is_verified', true).eq('is_rejected', false).order('posted_on', { ascending: false });
      if (error) throw error;

      const formattedData = data.map((article: Article) => ({
        ...article,
        posted_on: new Date(article.posted_on).toLocaleDateString(),
      }));

      setArticles(formattedData);
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 ">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow">
        <section className="mb-12">
          <TrendingCarousel articles={articles} />
        </section>

        <section className="container mx-auto px-4 mb-12 ">
          <h2 className="text-3xl font-bold mb-4">Latest News</h2>
          <LatestNewsCarousel articles={articles} />
        </section>
      </main>

      <Footer/>


    </div>
   
  );
}