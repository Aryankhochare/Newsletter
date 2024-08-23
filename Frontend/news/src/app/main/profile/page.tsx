import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
 
const ProfilePage = dynamic(() => import('@/components/Profile'), {
  loading: () => <ProfileSkeleton />,
});
 
const VerifiedArticles = dynamic(() => import('@/components/VerifiedArticles'), {
  loading: () => <VerifiedArticlesSkeleton />,
});
 
function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[600px]">
            <ProfilePage />
          </div>
          <div className="h-[600px]">
            <VerifiedArticles />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
 
const ProfileSkeleton = () => (
  <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8 animate-pulse h-full">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
  </div>
);
 
const VerifiedArticlesSkeleton = () => (
  <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8 h-full flex flex-col animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="overflow-y-auto flex-grow">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 shadow mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);
 
export default Page;