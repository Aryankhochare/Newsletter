"use client";
import React, { useState, useEffect } from 'react';
import QuillEditor from '@/components/quilleditor/QuillEditor';
import ImageUploader from "@/components/quilleditor/ImageUploader";
import Navbar from '@/components/navbarcomp/navbar';
import { PenTool } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
 
interface userNews {
  news_id: string;
  category_id: string;
  news_title: string;
  content: string;
  cover_image: string;
  is_verified: boolean;
  is_rejected: boolean;
  is_draft: boolean;
}
 
export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<any>('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [userArticles, setUserArticles] = useState<userNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<userNews | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSave = (title: string, content: string) => {
    console.log('Updated news:', { title, content });
  };
 
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
 
  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };
 
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
      setUserId(userIdFromData);
    } catch (error) {
      console.log("Error fetching comments!", error);
    }
  };
 
  const fetchUserArticles = async () => {
    if (userId) {
      const { data, error } = await supabase
        .from('News')
        .select('news_id, category_id, news_title, content, cover_image, is_verified, is_rejected, is_draft')
        .eq('user_id', userId);
 
      if (error) {
        console.log('Error fetching rejected news:', error);
      } else {
        setUserArticles(data || []);
      }
    }
  };
 
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/newsletter', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
     
      if (!response.ok) {
        throw new Error('Network response was not okay');
      }
     
      await fetchUserArticles();
    } catch (error) {
      console.log("Error deleting articles!", error);
    }
  };
 
  useEffect(() => {
    fetchUserId();
  }, []);
 
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      fetchUserArticles().finally(() => setIsLoading(false));
    }
  }, [userId]);
 
  const [rejected, setRejected] = useState<userNews[]>([]);
  const [pending, setPending] = useState<userNews[]>([]);
  const [draft, setDrafted] = useState<userNews[]>([]);
 
  useEffect(() => {
    const rejectedArticles = userArticles.filter(article => article.is_verified && article.is_rejected);
    const pendingArticles = userArticles.filter(article => !article.is_verified && !article.is_draft);
    const draftArticles = userArticles.filter(article => article.is_draft);
 
    setRejected(rejectedArticles);
    setPending(pendingArticles);
    setDrafted(draftArticles);
  }, [userArticles]);
 
  const handleEdit = (id: string) => {
    setIsLoading(true);
    setSelectedNews(null);
    setTimeout(() => {
      const newsItem = userArticles.find((item) => item.news_id === id) || null;
      if (newsItem == null) {
        alert("No news selected!");
      } else {
        setSelectedNews(newsItem);
      }
      setIsLoading(false);
    }, 0);
  };
 
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    rejected: false,
    pending: false,
    draft: false,
  });
 
  const toggleSection = (section: string) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };
 
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex justify-center text-center mt-4">
        <PenTool className="mr-2 h-8 w-8" />
        <span className="text-2xl text-center font-bold">Writer Workspace</span>
      </div>
      <div className="w-full container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full lg:w-full flex flex-col lg:flex-row">
        {isLoading ? (
        <div>Loading articles...</div>
        ) : (
          <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Article Status</h2>
              <div className="flex flex-col gap-4">
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => toggleSection('rejected')}
                    className="flex justify-between items-center w-full py-2 text-left text-gray-800 font-medium"
                  >
                    Review Rejected Articles
                    <span>{openSections.rejected ? '-' : '+'}</span>
                  </button>
                  {openSections.rejected && (
                    <div className="flex flex-col gap-4">
                      <ul className="space-y-4">
                        {rejected.map((unv) => (
                          <li key={unv.news_id} className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                            <div
                              onClick={() => handleEdit(unv.news_id)}
                              className="flex-grow cursor-pointer hover:bg-gray-200 p-2 rounded"
                            >
                              <span className="text-gray-800 font-medium">{unv.news_title}</span>
                            </div>
                            <button
                              onClick={() => handleDelete(unv.news_id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 ease-in-out"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => toggleSection('pending')}
                    className="flex justify-between items-center w-full py-2 text-left text-gray-800 font-medium"
                  >
                    Articles on Review
                    <span>{openSections.pending ? '-' : '+'}</span>
                  </button>
                  {openSections.pending && (
                    <div className="flex flex-col gap-4">
                      <ul className="space-y-4">
                        {pending.map((unv) => (
                          <li key={unv.news_id} className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                            <span className="text-gray-800 font-medium">{unv.news_title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => toggleSection('draft')}
                    className="flex justify-between items-center w-full py-2 text-left text-gray-800 font-medium"
                  >
                    Articles Drafted
                    <span>{openSections.draft ? '-' : '+'}</span>
                  </button>
                  {openSections.draft && (
                    <div className="flex flex-col gap-4">
                      <ul className="space-y-4">
                        {draft.map((unv) => (
                          <li key={unv.news_id} className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                            <div
                              onClick={() => handleEdit(unv.news_id)}
                              className="flex-grow cursor-pointer hover:bg-gray-200 p-2 rounded"
                            >
                              <span className="text-gray-800 font-medium">{unv.news_title}</span>
                            </div>
                            <button
                              onClick={() => handleDelete(unv.news_id)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-200 ease-in-out"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="w-full lg:w-full bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Article Content</h2>
            <div className="flex-grow w-full h-full">
              {isLoading ? (
                <div>Loading...</div>
                ) : selectedNews ? (
                <QuillEditor
                  key={selectedNews.news_id}
                  initialId={selectedNews.news_id}
                  initialTitle={selectedNews.news_title}
                  initialContent={selectedNews.content}
                  onSuccess={fetchUserArticles}
                />
                ) : (
                <QuillEditor
                  initialContent=""
                  initialTitle=""
                  onSuccess={fetchUserArticles}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}