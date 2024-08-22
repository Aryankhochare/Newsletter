"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { useMainStore } from '@/components/ArticleStore';
import Comments from '@/components/Comments';
import { BsChatText } from "react-icons/bs";

import { parseISO, format } from 'date-fns';
import parse from 'html-react-parser'

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

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    if (navbar) setNavbarHeight(navbar.offsetHeight);
    if (footer) setFooterHeight(footer.offsetHeight);
  }, []);

  return (
    <>
    <div className="bg-white min-h-screen flex flex-col text-black">
      <div id="navbar" className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className=" min-h-screen flex-grow overflow-hidden relative">
        <article className={`m-10 transition-all duration-300 ease-in-out ${showComments ? 'w-full lg:w-3/5 xl:w-3/4' : 'w-full'} overflow-y-auto`}>
          <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black leading-tight">
              {parse(article_title)}
            </h1>
            <div className="flex flex-col items-start text-md text-gray-600 mb-8">
              <span className="mr-4">Author: {article_writer}</span>
              <span>Published: {format(parseISO(article_date), 'dd-MMM-yyyy')}</span>
            </div>
            <img
              src={article_image}
              alt="Article image"
              className="object-fit h-auto mb-8 rounded-lg shadow-md"
            />
            <div className="prose prose-xl max-w-none">
              <div className="mb-6 text-lg leading-relaxed">{parse(article_content)}</div>
            </div>
          </div>
        </article>

        {!showComments && (
          <button
            className="fixed bottom-14 right-4 p-2 z-50 transition-colors duration-200"
            onClick={() => setShowComments(!showComments)}
          >
            <BsChatText className="w-9 h-9 text-black hover:text-indigo-600" />
          </button>
        )}

         <div
          className={`fixed right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${
            showComments ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          style={{
            top: `${navbarHeight}px`,
            bottom: `${footerHeight}px`,
            height: `calc(100vh - ${navbarHeight}px)`
          }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Comments</h2>
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

          <div className="flex-grow overflow-y-auto scrollbar-hide ">
            <Comments article_id={article_id} />
          </div>
        </div>
      </main>
      <div className="relative z-50">

<Footer/>
</div>
    </div>
   
    </>
  );
};

export default NewsPage;