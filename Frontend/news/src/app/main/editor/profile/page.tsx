import Footer from '@/components/navbarcomp/footer';
import Navbar from '@/components/navbarcomp/navbar';
import React from 'react';
import { FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

const EditorProfile = () => {
  const editor = {
    name: "Sam Smith",
    role: "Editor",
    email: "sam.smith@newsletter.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "2023-01-15",
    recentArticles: [
      { title: "The Future of AI in Journalism", date: "2024-08-15" },
      { title: "Breaking News: How to Stay Ahead", date: "2024-08-10" },
      { title: "Engaging Your Audience: Top Tips", date: "2024-08-05" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-200 ">
       <div className="sticky top-0 z-50">
        <Navbar/>
      </div>
      <main className=" min-h-screen mx-auto bg-white p-4  shadow-lg overflow-hidden">
        <div className="relative h-48 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-white tracking-wider">Profile</h1>
          </div>
        </div>
        
        <div className="md:flex">
          
          <div className="md:w-1/2 p-6">
            <div className="relative">
              <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                  <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                    {editor.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 md:mt-16">
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-semibold">{editor.name}</h2>
                <p className="text-indigo-600 font-medium text-sm">{editor.role}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${editor.email}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {editor.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <a href={`tel:${editor.phone}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {editor.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(editor.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles Section */}
          <div className="md:w-1/2 p-6 bg-gray-50 ">
            <h3 className="text-xl font-semibold mb-4">Review Articles</h3>
            <div className="space-y-4">
              {editor.recentArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <h4 className="font-medium">{article.title}</h4>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default EditorProfile;
