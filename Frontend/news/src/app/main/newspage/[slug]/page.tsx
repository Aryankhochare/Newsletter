

"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { useMainStore } from '@/components/ArticleStore';
import Comments from '@/components/Comments';
import { BsChatText } from "react-icons/bs";

import { parseISO, format } from 'date-fns';
import parse from 'html-react-parser'
import { useParams } from 'next/navigation';
import { apiLinks } from '@/utils/constants';
import Image from 'next/image';


interface NewsPageProps {
  params: { slug: string };
}



const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
  const { slug } = params;
  const [showComments, setShowComments] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const article_id = useMainStore((state) => state.id);
  const article_title = useMainStore((state) => state.title);
  const article_content = useMainStore((state) => state.editorContent);
  const article_image = useMainStore((state) => state.coverImage);
  const article_writer = useMainStore((state) => state.userName)
  const article_date = useMainStore((state) => state.postedOn)
  
  //console.log({article_id});
  
  const urlParams = useParams();
  const url = urlParams.slug as string;
  
  

  function getTextAfterAtSymbol(url:string) {
    const atIndex = url.indexOf('%40');
    if (atIndex === -1) {
        return ''; 
    }
    console.log(url.substring(atIndex + 3));
    
    return url.substring(atIndex + 3);
}

const fetchContent = async () => {
  try {
    const response = await fetch(
     `${apiLinks.newsletter.fetch}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
  }
};


return (
  <>
  <div className="bg-white min-h-screen flex flex-col text-black">
    <div id="navbar" className="sticky top-0 z-50">
      <Navbar />
    </div>

    <main className="min-h-screen flex-grow overflow-hidden relative">
      <article className={`sm-m-10 transition-all duration-300 ease-in-out ${showComments ? 'w-full lg:w-3/5 xl:w-3/4' : 'w-full'} overflow-y-auto`}>
        <div className="max-w-full sm:max-w-5xl mx-auto p-4 sm:p-10 bg-white shadow-xl rounded-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black leading-tight">
            {parse(article_title)}
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm sm:text-md text-gray-600 mb-8">
            <span className="mb-2 sm:mb-0 sm:mr-4">Author: {article_writer}</span>
            <span>Published: {format(parseISO(article_date), 'dd-MMM-yyyy')}</span>
           
          </div>
          <Image
            src={article_image}
            alt="Article image"
            className="object-contain w-full h-auto mb-6 sm:mb-8 rounded-lg shadow-md"
          />
          <div className="prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none">
            <div className="mb-6 text-base sm:text-lg leading-relaxed">{parse(article_content)}</div>
          </div>
        </div>
      </article>

      {!showComments && (
        <button
          className="fixed bottom-6 sm:bottom-14 right-4 sm:right-6 p-2 z-50 transition-colors duration-200"
          onClick={() => setShowComments(!showComments)}
        >
          <BsChatText className="w-8 sm:w-9 h-8 sm:h-9 text-gray-600 hover:text-indigo-600" />
        </button>
      )}
     
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
          showComments ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        style={{
          top: `${navbarHeight}px`,
          bottom: `${footerHeight}px`,
          height: `calc(100vh - ${navbarHeight}px)`
        }}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg sm:text-2xl font-bold text-white">Comments</h2>
          <button
            className="text-gray-400 hover:text-white transition-colors duration-200"
            onClick={() => setShowComments(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto scrollbar-hide">
          <Comments article_id={article_id} />
        </div>
      </div>
    </main>
    <div id="footer" className="relative z-50">
      <Footer/>
    </div>
  </div>
  </>
);
};

export default NewsPage;
