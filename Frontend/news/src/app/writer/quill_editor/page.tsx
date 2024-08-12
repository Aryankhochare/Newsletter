'use client'

import React, { useState } from "react";
import QuillEditor from '../../../components/QuillEditor';
import ImageUploader from "@/components/ImageUploader";
import { PenTool} from 'lucide-react';


export default function Home() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };
  return (
      <main className="flex flex-col min-h-screen bg-gray-100">
         <div className="sticky top-0 z-50">
      {/* <Navbar /> */}
    </div>
    <div className="flex justify-center text-center mt-4">
      <PenTool className="mr-2 h-8 w-8" />
      <span className="text-2xl text-center font-bold">Writer&apos;s Workspace</span>
    </div>
    <div className="w-full container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="w-full lg:w-full flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div className="w-full mr-1 lg:w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Article Status</h2>
              <div className="flex flex-col gap-4">
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option>Rejected Articles</option>
                  {/* Add options for rejected articles */}
                </select>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option>Articles on Review</option>
                  {/* Add options for articles on review */}
                </select>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option>Articles Posted</option>
                  {/* Add options for articles posted */}
                </select>
              </div>
            </div>
  
            {/* Right Main Content */}
            <div className="w-full lg:w-full bg-white shadow-lg rounded-lg p-6 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Article Content</h2>
              <div className="flex-grow w-full h-full">
                <QuillEditor />
              </div>
            </div>
          </div>
        </div>
      </main>
      );
    }
