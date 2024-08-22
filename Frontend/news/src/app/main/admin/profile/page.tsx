import Footer from '@/components/navbarcomp/footer';
import Navbar from '@/components/navbarcomp/navbar';
import React from 'react';
import { FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

const AdminProfile = () => {
  const admin = {
    name: "Jane Doe",
    role: "Admin",
    email: "jane.doe@newsletter.com",
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
       
      <main className=" min-h-screen mx-auto bg-white  shadow-lg overflow-hidden p-4">
      
        <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
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
                    {admin.name.charAt(0)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 md:mt-16">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold">{admin.name}</h2>
                <p className="text-indigo-600 font-medium text-sm">{admin.role}</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${admin.email}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {admin.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <a href={`tel:${admin.phone}`} className="text-sm text-gray-600 hover:text-indigo-600">
                    {admin.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Joined {new Date(admin.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles Section */}
          <div className="md:w-1/2 p-6 bg-gray-50 ">
            <h3 className="text-xl font-semibold mb-4">Recent Articles</h3>
            <div className="space-y-4">
              {admin.recentArticles.map((article, index) => (
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

export default AdminProfile;


// "use client";
// import React, { useState, useEffect } from 'react';
// import { FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
// import { supabase } from '@/app/api/auth/[...nextauth]/route';

// const AdminProfile = () => {
//   const [admin, setAdmin] = useState(null);
//   const [recentArticles, setRecentArticles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch admin data from Users table
//         let { data: userData, error: userError } = await supabase
//           .from('Users')
//           .select('username, user_email, created_date')
//           .single();

//         if (userError) throw userError;

//         if (!userData) {
//           throw new Error('No admin user found.');
//         }

//         console.log('Admin data fetched:', userData);

//         // Fetch recent articles from News table
//         let { data: newsData, error: newsError } = await supabase
//           .from('News')
//           .select('news_title, posted_on')
//           .order('posted_on', { ascending: false })
//           .limit(3);

//         if (newsError) throw newsError;

//         console.log('Recent articles fetched:', newsData);

//         setAdmin({
//           name: userData.username,
//           role: 'Admin',
//           email: userData.user_email,
//           phone: '+1 (555) 123-4567', // Assuming phone number is not stored in the database
//           joinedDate: userData.created_date,
//         });

//         setRecentArticles(newsData);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError(error.message);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   if (error) {
//     return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;
//   }

//   if (!admin) {
//     return <div className="min-h-screen flex items-center justify-center">No admin data available.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-100 to-indigo-200 p-4">
//       <div className="max-w-full min-h-full mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
//         <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600">
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h1 className="text-3xl font-bold text-white tracking-wider">Profile</h1>
//           </div>
//         </div>

//         <div className="md:flex">
//           <div className="md:w-1/2 p-6">
//             <div className="relative">
//               <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0">
//                 <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
//                   <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-4xl font-bold text-white">
//                     {admin.name ? admin.name.charAt(0) : '?'}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-20 md:mt-16">
//               <div className="text-center md:text-left">
//                 <h2 className="text-2xl font-semibold">{admin.name || 'N/A'}</h2>
//                 <p className="text-indigo-600 font-medium text-sm">{admin.role || 'N/A'}</p>
//               </div>

//               <div className="mt-6 space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <FaEnvelope className="text-gray-400" />
//                   <a href={mailto:${admin.email}} className="text-sm text-gray-600 hover:text-indigo-600">
//                     {admin.email || 'N/A'}
//                   </a>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaPhone className="text-gray-400" />
//                   <a href={tel:${admin.phone}} className="text-sm text-gray-600 hover:text-indigo-600">
//                     {admin.phone || 'N/A'}
//                   </a>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <FaCalendar className="text-gray-400" />
//                   <span className="text-sm text-gray-600">
//                     Joined {admin.joinedDate ? new Date(admin.joinedDate).toLocaleDateString() : 'N/A'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Recent Articles Section */}
//           <div className="md:w-1/2 p-6 bg-gray-50">
//             <h3 className="text-xl font-semibold mb-4">Recent Articles</h3>
//             <div className="space-y-4">
//               {recentArticles.length > 0 ? (
//                 recentArticles.map((article, index) => (
//                   <div key={index} className="bg-white rounded-lg p-4 shadow">
//                     <h4 className="font-medium">{article.news_title}</h4>
//                     <p className="text-sm text-gray-500">{new Date(article.posted_on).toLocaleDateString()}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No recent articles available.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProfile;