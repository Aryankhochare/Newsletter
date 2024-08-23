'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { apiLinks } from '@/utils/constants';
 
interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  status: string;
  userRoleNames: string[];
  categoryNames: string[];
  createdDate: Date;
  modifiedDate: Date;
}
 
const VerifiedArticles = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User>();
  const [verifiedArticles, setVerifiedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
 
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user) {
        try {
          const response = await axios.get(apiLinks.admin.fetchUser);
          const users = response.data;
          const currentUser = users.find((user: any) => user.email === session.user?.email);
          if (currentUser) {
            setUserDetails(currentUser);
            const articlesResponse = await axios.get(apiLinks.newsletter.verifiedArticles);
            const verifiedArticles = articlesResponse.data.filter((article: any) => article.userId === currentUser.id);
            setVerifiedArticles(verifiedArticles);
          } else {
            setError('User not found');
          }
        } catch (err) {
          setError('Error fetching user details');
          console.error('Error fetching user details:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserDetails();
  }, [session]);
 
  if (loading) return <VerifiedArticlesSkeleton />;
  if (error) return <div className="text-red-500 text-center p-4 text-xl font-semibold">Error: {error}</div>;
  if (!userDetails) return <div className="text-gray-500 text-center p-4 text-xl font-semibold">No user details found</div>;
 
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Verified Articles</h2>
      <div className="overflow-y-auto flex-grow">
        {verifiedArticles.length > 0 ? (
          <ul className="space-y-4 pr-2">
            {verifiedArticles.map((article) => (
              <li key={article.id} className="bg-gray-50 rounded-lg p-4 shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-1">{article.categoryName}</p>
                <p className="text-gray-500 text-sm">{new Date(article.modifiedDate).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No verified articles found.</p>
        )}
      </div>
    </div>
  );
};
 
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
 
export default VerifiedArticles;