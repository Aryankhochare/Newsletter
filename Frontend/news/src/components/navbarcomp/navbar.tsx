// // 'use client'
// // import React, { useState, useEffect } from 'react';
// // import Link from 'next/link';
// // import Sidebar from './Sidebar';
// // import ProfileInfo from './profileinfo';
// // import { DM_Serif_Display } from '@next/font/google';



// // const Dmse = DM_Serif_Display({subsets:["latin"], weight:["400"]});

// // export default function Navbar() {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const [userRole, setUserRole] = useState<string | null>(null);

// //     useEffect(() => {
// //         if (typeof window !== 'undefined') {
// //             const role = localStorage.getItem('userRole');
// //             setUserRole(role);
// //         }
// //     }, []);

// //     const toggleSidebar = () => {
// //         setIsSidebarOpen(!isSidebarOpen);
// //     };

// //     return (

// //         <div>
// //             <header className="flex justify-between gap-5 items-center px-5 bg-black text-white py-5 shadow-md">
// //                 <div className="bg-gray-100">
// //                     <button
// //                         className="top-4 left-4 z-50 text-white bg-black p-2"
// //                         onClick={toggleSidebar}
// //                     >
// //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //                         </svg>
// //                     </button>
// //                 </div>
// //               <div className={`${Dmse.className}`}>
// //                 <h1 className="text-4xl text-white  text-center" >THE  GLOBAL  BUZZ</h1>
// //                 </div>
                
// //                 {userRole === 'user' ? (
// //                     <div className="flex space-x-4">
// //                         <Link href="/login" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
// //                             Login
// //                         </Link>
// //                         <Link href="/signup" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
// //                             Sign Up
// //                         </Link>
// //                     </div>
// //                 ) : (
// //                     <ProfileInfo />
// //                 )}
// //             </header>
// //             <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
// //         </div>
// //     );
// // }

'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/navbarcomp/Sidebar';

import ProfileInfo from '@/components/navbarcomp/profileinfo';
import { DM_Serif_Display } from 'next/font/google';
import { Anton } from 'next/font/google';

const Dmse = DM_Serif_Display({ subsets: ["latin"], weight: ["400"] }) ;
const Mmse = Anton({ subsets: ["latin"], weight: ["400"]});


export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <header className="flex justify-between gap-5 items-center px-5 bg-black text-white py-5 shadow-md">
        <div className="bg-gray-100">
          <button
            className="top-4 left-4 z-50 text-white bg-black p-2 "
            onClick={toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
{/*         
        <div className='text-center'>
        <div className={`${Dmse.className} text-4xl`}>
         <span className="hidden sm:block" >THE GLOBAL BUZZ</span>
        </div>
        <div className={`${Mmse.className} text-4xl `}>
        <span className="block sm:hidden italic">TGB</span>
        </div>
        </div> */}


<div className='text-center'>
        <Link href={"/main"}
         className={`${Dmse.className} text-4xl`}>
         <span className="hidden sm:block" >THE GLOBAL BUZZ</span>
       
        <div className={`${Mmse.className} text-4xl `}>
        <span className="block sm:hidden italic">TGB</span>
        </div>
        </Link>
        </div>


        <div className="flex space-x-4 items-center">
          {userRole === 'user' ? (
            <>
              <Link href="/login" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                Login
              </Link>
              <Link href="/signup" className="bg-gray-950 hover:underline hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
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


