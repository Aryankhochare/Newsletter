"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const categories = ['Politics', 'Sports', 'Technology', 'Food', 'Tourism', 'Health', 'Business', 'Crime', 'Education', 'Finance', 'Lifestyle', 'Entertainment'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-72 bg-black text-gray-100 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
    >
      
      <div className="p-6">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-200"
              >
                <span>Categories</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <ul className="mt-2 space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <Link 
                        href={`/category/${category.toLowerCase()}`}
                        className="block py-2 px-6 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-200"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;