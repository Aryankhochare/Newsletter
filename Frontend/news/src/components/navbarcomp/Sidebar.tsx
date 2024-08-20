"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  categoryId: string;
  categoryName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    if (categoriesRef.current) {
      if (isDropdownOpen) {
        categoriesRef.current.style.maxHeight = `${categoriesRef.current.scrollHeight}px`;
      } else {
        categoriesRef.current.style.maxHeight = '0';
      }
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://globalbuzz.azurewebsites.net/api/category');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    onClose(); // Close the sidebar after navigation
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-72 bg-black text-gray-100 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 overflow-y-auto scrollbar-hide`}
    >
      <div className="p-6 scrollbar-hide">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors duration-200 scrollbar-hide"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white static">Menu</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/main" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-200 scrollbar-hide">
                Home
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex border-white border-4 items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-200 scrollbar-hide"
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
              <div 
                ref={categoriesRef}
                className="mt-1 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ maxHeight: '0' }}
              >
                <ul className="space-y-2 border-white border-t-0 border-4 max-h-64 overflow-y-auto scrollbar-hide">
                  {categories.map((category) => (
                    <li key={category.categoryId}>
                      <Link
                        // href={`/category/${category.categoryName}`}
                        href = {`/main/category/${category.categoryName}`}
                        className="scrollbar-hide block py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors duration-200 w-full text-left"
                        onClick={() => handleCategoryClick(category.categoryName)}
                      >
                        {category.categoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;