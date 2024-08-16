"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Sidebar from '@/components/navbarcomp/Sidebar';
import Navbar from '@/components/navbarcomp/navbar';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Article {
  category: string;
  title: string;
  createdDate: string;
  modifiedDate: string;
  writer: string;
  imageUrl: string;
  content: string;
}

interface CategoryPageProps {
  params: { category: string };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const { category } = params;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Fetch articles
    fetch('/articles.json')
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter((article: Article) => 
          article.category.toLowerCase() === category.toLowerCase()
        );
        setArticles(filtered);
      })
      .catch(error => console.error('Error fetching articles:', error));

    // Get user role from localStorage or your auth system
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [category]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ViewMoreButton = ({ article }: { article: Article }) => {
    if (userRole && userRole !== 'user') {
      return (
        <Link href={`/main/newspage/${article.title.toLowerCase().replace(/ /g, '-')}`} className="underline text-blue-600 hover:text-blue-800">
          View more...
        </Link>
      );
    } else {
      return (
        <Dialog>
          <DialogTrigger className="underline text-blue-600 hover:text-blue-800">View more...</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
            </DialogHeader>
            <p>Please login to continue reading this article.</p>
          </DialogContent>
        </Dialog>
      );
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className='flex flex-grow overflow-hidden'>
        <div className='flex-grow scrollbar-hide md:w-7/10 overflow-y-auto p-4 md:mx-16 md:m-4'>
          {articles.map((article, index) => (
            <div key={index} className='mb-8 pb-4 border-b'>
              <h2 className='font-bold text-xl mb-2'>{article.title}</h2>
              <div className='flex'>
                <div className="flex-1 pr-4 text-sm">
                  {article.content.substring(0, 150)}...
                  <ViewMoreButton article={article} />
                </div>
                <div className='w-1/3 flex items-start'>
                  <Image 
                    src={article.imageUrl} 
                    alt={article.title} 
                    width={200} 
                    height={150} 
                    className='w-full h-auto max-h-24 object-cover' 
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                By: {article.writer} | Created: {article.createdDate} | Modified: {article.modifiedDate}
              </div>
            </div>
          ))}
        </div>

        <div className='scrollbar-hide m-10 hidden md:block md:w-3/12 p-0 bg-black shadow-slate-600 shadow-2xl overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]'>
          {articles.map((article, index) => (
            <div key={index} className='p-4 border-b border-gray-700'>
              <Image 
                src={article.imageUrl} 
                alt={article.title} 
                width={400} 
                height={300} 
                className='w-full h-40 object-cover mb-2' 
              />
              <div className='font-bold text-lg mb-2 text-white'>{article.title}</div>
              <div className='text-sm text-gray-400'>{article.content.substring(0, 100)}...</div>
            </div>
          ))}
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </div>
  );
}

export default CategoryPage;