// src/app/category/[category]/page.tsx
"use client"
import React,{useState} from 'react';
import Image from "next/image";
import Sidebar from '@/components/Sidebar';
import ProfileInfo from '@/components/profileinfo';
import Navbar from '@/components/navbar';
import Link from 'next/link';


interface CategoryPageProps {
  params: { category: string };
}


    const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
      const { category } = params;
     

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

      
  return (
    <div>
     <Navbar/>
      <div className="text-2xl m-2 font-bold text-center">
      {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'} News
      </div>

      <div className='grid gap-2 md:grid-cols-10  '>


      <div className='p-4 mx-16 m-4 h-screen bg-white shadow-black shadow-2xl col-span-7'>
  <div className='flex flex-col h-full'>
    <h1 className='font-bold text-2xl mb-4'>Two Centuries Later, a Female Composer Is Rediscovered</h1>
    
    <div className='flex flex-grow'>
      <div className="flex-1 pr-4 text-sm">
        "A secret appointment exists between past generations and our own," Walter Benjamin wrote. "Our arrival on earth was expected." At pivotal moments, the philosopher argued, voices from the past reach out to us with prophetic force.
        <Link href={`/newspage/female-composer-rediscovered`} className="underline text-blue-600 hover:text-blue-800">View more...</Link> 
      
      </div>
      
      <div className='w-1/3 flex items-start'>
        <img src='https://i.postimg.cc/VkfFzQ2v/image.png' alt='image' className='w-full h-auto max-h-32 object-cover'></img>  
      </div>
    </div>
  </div>
</div>

        <div className='mr-5 m-4 mb-4 bg-black shadow-slate-600 shadow-2xl col-span-3 sm:block hidden'>
          <div className='p-4'>
        <img src='https://i.postimg.cc/BQL6QJdn/pexels-yovanverma-2082103.jpg' alt='image'></img>
        <div className='font-bold text-2xl mb-4 text-white'>Two Centuries Later, a Female Composer Is Rediscovered</div>
        </div>

        <div className='p-4'>
        <img src='https://i.postimg.cc/BQL6QJdn/pexels-yovanverma-2082103.jpg' alt='image'></img>
        <div className='font-bold text-2xl mb-4 text-white'>Two Centuries Later, a Female Composer Is Rediscovered</div>
        </div>

        </div>



        </div>


      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </div>
  );
}
export default CategoryPage;
  
