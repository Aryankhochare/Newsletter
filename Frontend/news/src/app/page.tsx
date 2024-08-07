import React from 'react';
import Image from "next/image";
import Navbar from '@/components/navbar';

// Define the interface for an article
interface Article
 {
  category: string;
  title: string;
  createdDate: string;
  modifiedDate: string;
  writer: string;
  imageUrl: string;
  content: string;
}

// Server Component for fetching data
async function getArticles(): Promise<Article[]> {
  const res = await fetch('http://localhost:3000/articles.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }
  return res.json();
}

export default async function Home() {
  const articles = await getArticles();
  const trendingArticles = articles.length > 0 ? [articles[0]] : [];

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {/* Trending section */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Trending Now</h2>
            {trendingArticles.map((article, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center mb-8">
                <div className="relative w-full h-64 md:w-1/2 mb-4 md:mr-10 md:pr-4 md:h-80">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    quality={75}
                  />
                </div>
                <div className="md:w-1/2">
                  <span className="inline-block bg-black text-white rounded-full px-3 py-1 text-sm font-semibold mb-4">{article.category}</span>
                  <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.content}</p>
                  <p className="text-sm text-gray-500">By: {article.writer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          <section className="space-y-8">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-2">{article.category}</span>
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.content}</p>
                    <p className="text-sm text-gray-500">By: {article.writer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}