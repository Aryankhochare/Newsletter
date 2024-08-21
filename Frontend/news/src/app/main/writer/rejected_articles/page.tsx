"use client"
import React, { useState, useEffect } from 'react';
import QuillEditor from '@/components/quilleditor/QuillEditor';
import Navbar from '@/components/navbarcomp/navbar';
import { supabase } from '@/app/api/auth/[...nextauth]/route';
import { PenTool } from 'lucide-react';

interface News {
  news_id: string;
  news_title: string;
  content: string;
}

export default function Home() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [rejected, setRejected] = useState<News[]>([]);
    const [selectedNews, setSelectedNews] = useState<News | null>(null);
    const [content, setSelectedContent] = useState<string | null>(null);
    const [userId, getUserId] = useState<any>('');

    const fetchUserId = async () => {
        try {
          const response = await fetch(`/api/comment-route/fetch-user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const userIdFromData = data.userId;
          getUserId(userIdFromData);
          console.log('userId:', userIdFromData);
        } catch (error) {
          console.log("Error fetching comments!", error);
        }
      };

    
      
    const fetchRejected = async () => {
        if (userId) {
          const { data, error } = await supabase
            .from('News')
            .select('news_id, news_title, content')
            .eq('is_verified', true)
            .eq('is_rejected', true)
            .eq('user_id', userId);
      
          if (error) {
            console.log('Error fetching rejected news:', error);
          } else {
            setRejected(data || []);
          }
        }
      };
      useEffect(() => {
        fetchUserId();
    }, []);
    
      useEffect(() => {
        if (userId) {
          fetchRejected();
        }
      }, [userId, fetchRejected]);
    
    const handleEdit = (id: string) => {
        const newsItem = rejected.find((item) => item.news_id === id) || null;
        if (newsItem == null) {
            alert("No news selected !");
            setSelectedNews(null);
        } else {
            setSelectedNews(newsItem);
            setSelectedContent(newsItem.content);
            console.log(selectedNews);
        }
    }

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };
  
    const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAuthor(event.target.value);
    };
    
    return (
        <main className="flex flex-col min-h-screen bg-gray-100">
            <div className="sticky top-0 z-50">
                <Navbar />
            </div>
            <div className="flex justify-center items-center text-center mt-4">
                <PenTool className="mr-2 h-8 w-8 text-gray-600" />
                <span className="text-2xl font-bold text-gray-800">Writer Workspace</span>
            </div>
            <div className="w-full container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar */}
                <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-6 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Rejected Articles</h2>
                    <div className="flex flex-col gap-4">
                        <ul className="space-y-4">
                            {rejected.map((unv) => (
                                <li
                                    key={unv.news_id}
                                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <span className="text-gray-800 font-medium">{unv.news_title}</span>
                                    <button
                                        onClick={() => handleEdit(unv.news_id)}
                                        className="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                                    >
                                        Edit Article
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Right Main Content */}
                <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-lg p-6 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Article Content</h2>
                    <div className="flex-grow">
                        {selectedNews ? (
                            <QuillEditor 
                                key={selectedNews.news_id}
                                initialId={selectedNews.news_id}
                                initialTitle={selectedNews.news_title}
                                initialContent={selectedNews.content}
                                //className="h-96"
                            />
                        ) : (
                            <QuillEditor 
                                initialContent=""
                                initialTitle=""
                                //className="h-96"
                            />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}



