'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMainStore } from '@/components/ArticleStore';

interface Result {
    id: string;
    userId: string;
    userName: string;
    categoryId: string;
    categoryName: string;
    title: string;
    editorContent: string;
    postedOn: string;
    modifiedOn: string;
    coverImage: string;
    isVerified: boolean;
    isRejected: boolean;
}

interface SearchResultsClientProps {
  query: string;
  results: Result[];
  error: string | null;
}

export default function SearchResultsClient({ query, results, error }: SearchResultsClientProps) {
  const [loading, setLoading] = useState(false);

  const sendArticle = useMainStore(state => state.setMainArticle);

  useEffect(() => {
    if (!results) {
      setLoading(true);
   
      setTimeout(() => setLoading(false), 1000);
    }
  }, [results]);

  const handleClick = (article: Result) => {
    if (article) {
      sendArticle(article);
    } else {
      console.log("No content found !");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Results for "{query}"</h1>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-gray-600">No results found for "{query}".</p>
      )}
      {results.map((item, index) => (
        <article key={index} className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
          <h2 className="font-bold text-2xl mb-2 text-gray-800 hover:text-blue-600 transition-colors">
            <Link onClick={() => handleClick(item)} href={`/main/newspage/${item.title}@${item.id}`}>{item.title}</Link>
          </h2>
          <p className="text-sm mb-2 text-gray-600">By: {item.userName}</p>
          <p className="text-sm mb-3 text-gray-600">Category: {item.categoryName}</p>
          <div className="flex items-start">
            <div className="flex-grow pr-4">
              <p className="text-gray-700 leading-relaxed">
                {item.editorContent.substring(0, 150)}...
              </p>
            </div>
            {item.coverImage && (
              <div className="flex-shrink-0 ml-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-32 h-24 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 mt-3">
            Posted on: {new Date(item.modifiedOn).toLocaleDateString()}
          </div>
        </article>
      ))}
    </div>
  );
}
