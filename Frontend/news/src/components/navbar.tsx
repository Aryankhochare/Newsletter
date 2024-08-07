'use client'
import React, { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Sidebar from './Sidebar';
import ProfileInfo from './profileinfo';

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Top bar */}
            <header className="flex justify-between gap-5 items-center px-5 bg-black text-white py-5 shadow-md">
                <div className=" bg-gray-100">
                    {/* Hamburger button */}
                    <button
                        className=" top-4 left-4 z-50 text-white bg-black p-2  "
                        onClick={toggleSidebar}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-center">THE GLOBAL BUZZ</h1>
                <ProfileInfo />
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </div>
    );
}