'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/navbarcomp/Sidebar';
import ProfileInfo from '@/components/navbarcomp/profileinfo';
import { DM_Serif_Display } from 'next/font/google';
import { Anton } from 'next/font/google';
import { TbUserSearch } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";

const Dmse = DM_Serif_Display({ subsets: ["latin"], weight: ["400"] });
const Mmse = Anton({ subsets: ["latin"], weight: ["400"] });

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
      setSearchQuery(''); // Clear the search query after search
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-2 sm:px-5 bg-black text-white py-3 sm:py-5 shadow-md">
        <div className="flex items-center">
          <button
            className="text-white bg-black p-2"
            onClick={toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/main" className="ml-2 sm:ml-4">
            <span className={`${Mmse.className} text-2xl italic sm:hidden`}>TGB</span>
            <span className={`${Dmse.className} text-2xl sm:text-3xl hidden sm:inline lg:text-center`}>THE   GLOBAL   BUZZ</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search writer..."
              className="bg-gray-800 text-white px-2 py-1 rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="ml-2 text-white">
              <IoIosSearch className="h-6 w-6" />
            </button>
          </form>
          <button onClick={toggleSearch} className="text-white p-2 sm:hidden">
            <TbUserSearch className="h-6 w-6" />
          </button>
          {isSearchOpen && (
            <form onSubmit={handleSearch} className="absolute top-full left-0 right-0 bg-black p-2 sm:hidden">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search writer..."
                  className="flex-grow bg-gray-800 text-white px-2 py-1 rounded-l"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-gray-700 text-white px-2 py-1 rounded-r">
                  <IoIosSearch className="h-6 w-6" />
                </button>
              </div>
            </form>
          )}
          {userRole === '' ? (
            <>
              <Link href="/login" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
                Login
              </Link>
              <Link href="/signup" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base">
                Sign Up
              </Link>
            </>
          ) : (
            <ProfileInfo />
          )}
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </div>
  );
}

