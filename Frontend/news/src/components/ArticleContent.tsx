"use client";

import React, { useState, useEffect } from 'react';
import { useArticleStore } from './ArticleStore';
import parse from "html-react-parser";
import BackButton from './BackButton';
import { Skeleton } from "./ui/skeleton";

export default function ArticleContent() {
  const article_content = useArticleStore((state) => state.editorContent);
  const article_title = useArticleStore((state) => state.title);
  const cover_image = useArticleStore((state) => state.coverImage);
  const [showFeedback, setShowFeedback] = useState(false);
  const [factCheck, setFactCheck] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for article content
    const timer = setTimeout(() => {
      setContentLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFactCheck = async () => {
    setIsLoading(true);
    setShowFeedback(true);
    try {
      const response = await fetch('/api/verify-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: article_content,
          title: article_title,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch fact-check results');
      }
      const data = await response.json();
      setFactCheck(data.verification);
    } catch (error) {
      console.log('Error', error);
      setFactCheck('An error occurred while fact-checking the article');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className={`max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-lg border border-gray-200 transition-all duration-300 ${showFeedback ? 'sm:mr-96' : ''}`}>
        {contentLoading ? (
          <>
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900 leading-tight">
              {parse(article_title)}
            </h1>
            <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700">
              {parse(article_content)}
            </div>
            <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 flex items-center justify-center">
              <img 
                src={cover_image} 
                alt="Cover Image" 
                className="max-w-full h-auto" 
              />
            </div>
          </>
        )}
      </div>
      
      {!showFeedback && !contentLoading && (
        <div className="mt-12 flex justify-center space-x-6">
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transform transition-all duration-200" 
            onClick={handleFactCheck}
          >
            Fact Check
          </button>
        </div>
      )}

      <div
        className={`fixed mt-4 inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-2xl z-40 transition-transform duration-300 ease-in-out transform ${
          showFeedback ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        style={{ top: 'var(--navbar-height, 64px)' }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Fact checking</h2>
          <button
            className="text-gray-400 hover:text-white transition-colors duration-200"
            onClick={() => setShowFeedback(false)}
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
        <div className="scrollbar-hide flex-grow overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="text-white whitespace-pre-wrap">{factCheck}</div>
          )}
        </div>
      </div>
    </>
  );
}