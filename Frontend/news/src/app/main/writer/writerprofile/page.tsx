import React from 'react';
import { FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

const WriterProfile = () => {
  const writer = {
    name: "Viraj",
    role: "Writer",
    email: "viraj.naik@newsletter.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "2023-01-15",
    recentArticles: [
      { title: "The Future of AI in Journalism", date: "2024-08-15" },
      { title: "Breaking News: How to Stay Ahead", date: "2024-08-10" },
      { title: "Engaging Your Audience: Top Tips", date: "2024-08-05" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-200 p-4">
      <div className="max-w-full min-h-full mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600">
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
                    {writer.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 md:mt-16">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-semibold">{writer.name}</h2>
                <p className="text-indigo-600 font-medium text-sm">{writer.role}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${writer.email}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {writer.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <a href={`tel:${writer.phone}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {writer.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(writer.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles Section */}
          <div className="md:w-1/2 p-6 bg-gray-50 ">
            <h3 className="text-xl font-semibold mb-4">My Articles</h3>
            <div className="space-y-4">
              {writer.recentArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <h4 className="font-medium">{article.title}</h4>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterProfile;