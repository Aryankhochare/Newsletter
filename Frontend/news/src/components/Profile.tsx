'use client'
import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';
import { apiLinks } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
 
interface User {
  id: string,
  username: string;
  email: string;
  isActive: boolean;
  status: string;
  userRoleNames: string[];
  categoryNames: string[];
  createdDate: Date;
  modifiedDate: Date;
}

interface decodedToken {
  sub : string;
  email: string;
}
 
const ProfilePage = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter()
 

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (session?.accessToken) {
          const decodedToken = jwt.decode(session.accessToken) as decodedToken;
          const thisId = decodedToken.sub;
          const email = decodedToken.email.toString();
 
          const isUUID = (str: string) => {
            const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\$/;
            return uuidRegex.test(str);
          };
 
          let endpoint;
          if (isUUID(thisId)) {
            endpoint = `${apiLinks.user.fetch}/${thisId}`;
          } else {
            const userId = decodedToken.sub as string;
            endpoint = `${apiLinks.user.fetchEmail}/${email}`;
          }
 
          const response = await fetch(endpoint, {
            method: 'DELETE',
          });
 
          if (response.ok) {
            await signOut();
            router.push('/');
          } else {
            const errorText = await response.text();
            console.error('Error deleting account:', response.status, errorText);
            alert(`Failed to delete account. Status: ${response.status}. Please try again or contact support.`);
          }
        } else {
          alert('User email not found in session. Please try logging in again.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account.');
      }
    }
  };
 
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.user) {
        try {
          const response = await axios.get(apiLinks.admin.fetchUser);
          const users = response.data;
          const currentUser = users.find((user:any) => user.email === session.user?.email);
         
          if (currentUser) {
            setUserDetails(currentUser);
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
 
  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="text-red-500 text-center p-4 text-xl font-semibold">Error: {error}</div>;
  if (!userDetails) return <div className="text-gray-500 text-center p-4 text-xl font-semibold">No user details found</div>;
 
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
      <div className="space-y-4">
        <ProfileField label="Username" value={userDetails.username} />
        <ProfileField label="Email" value={userDetails.email} />
        <ProfileField label="Status" value={userDetails.status} />
        <ProfileField label="Roles" value={userDetails.userRoleNames.join(', ') || 'No roles assigned'} />
        <ProfileField label="Categories Preferred" value={userDetails.categoryNames.join(', ') || 'No categories assigned'} />
        <ProfileField label="Joined Date" value={new Date(userDetails.createdDate).toLocaleDateString()} />
      </div>
    </div>
  );
};
 
const ProfileField = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <p className="text-gray-800 font-semibold text-base bg-gray-100 p-2 rounded-md">{value}</p>
  </div>
);
 
const ProfileSkeleton = () => (
  <div className="bg-white shadow-xl rounded-lg p-6 lg:p-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    ))}
  </div>
);
 
export default ProfilePage;