// "use client";

// import React, { useState } from 'react';
// import Navbar from '@/components/navbarcomp/navbar';
// import Footer from '@/components/navbarcomp/footer';
// import { useMainStore } from '@/components/ArticleStore';
// import Comments from '@/components/Comments';

// interface NewsPageProps {
//   params: { slug: string };
// }

// const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
//   const { slug } = params;
//   const [showComments, setShowComments] = useState(false);
//   const article_id = useMainStore((state) => state.id);
//   const article_title = useMainStore((state) => state.title);
//   const article_content = useMainStore((state) => state.editorContent);
//   const article_image = useMainStore((state) => state.coverImage);
//   const article_writer = useMainStore((state) => state.userName)
//   const article_date = useMainStore((state) => state.postedOn)
  
//   //console.log({article_id});
  
//   return (
//     <div className="bg-white min-h-screen flex flex-col text-black">
//       <div className="sticky top-0 z-50">
//         <Navbar />
//       </div>

//       <div className="flex-grow overflow-hidden">
//         <article className={`m-10 transition-all duration-300 ease-in-out ${showComments ? 'w-full lg:w-3/5 xl:w-3/4' : 'w-full'} overflow-y-auto`}>
//           <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-lg">
//             <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black leading-tight">
//               {article_title}
//             </h1>
//             <div className="flex items-center text-lg text-black mb-8">
//               <span className="mr-4">Writer : {article_writer}</span>
//               <span>Posted on : {article_date}</span>
//             </div>
//             <img
//               src={article_image}
//               alt="Article image"
//               className="w-full h-auto mb-8 rounded-lg shadow-md"
//             />
//             <div className="prose prose-xl max-w-none">
//               <p className="mb-6 text-xl leading-relaxed">
//                 {article_content}
//               </p>
//             </div>
//             <div>
            
//         </div>
//           </div>
//         </article>

//         <button
//           className="fixed bottom-14 right-4 p-2 z-50 transition-colors duration-200"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <img
//             src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
//             alt="Comments button"
//             className="w-9 h-9"
//           />
//         </button>

//         <div
//           className={`fixed mt-4 inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
//             showComments ? 'translate-x-0' : 'translate-x-full'
//           } flex flex-col`}
//           style={{ top: 'var(--navbar-height, 64px)', bottom: 'var(--footer-height, 64px)' }}
//         >
//           <div className="flex justify-between items-center p-4 border-b border-gray-700">
//             <h2 className="text-2xl font-bold text-white">Comments</h2>
//             <button
//               className="text-gray-400 hover:text-white transition-colors duration-200"
//               onClick={() => setShowComments(false)}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-grow overflow-y-auto">
//             <Comments article_id={article_id} />
//           </div>
//         </div>
//       </div>

//       <div className="bottom-0 pb-0 mb-0 bg-black">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default NewsPage;

"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { useMainStore } from '@/components/ArticleStore';
import Comments from '@/components/Comments';
import { BsChatText } from "react-icons/bs";

import { parseISO, format } from 'date-fns';
import parse from 'html-react-parser'
import { useParams } from 'next/navigation';
import { apiLinks } from '@/utils/constants';
import Image from 'next/image';


interface NewsPageProps {
  params: { slug: string };
}



const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
  const { slug } = params;
  const [showComments, setShowComments] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const article_id = useMainStore((state) => state.id);
  const article_title = useMainStore((state) => state.title);
  const article_content = useMainStore((state) => state.editorContent);
  const article_image = useMainStore((state) => state.coverImage);
  const article_writer = useMainStore((state) => state.userName)
  const article_date = useMainStore((state) => state.postedOn)
  
  //console.log({article_id});
  
  const urlParams = useParams();
  const url = urlParams.slug as string;
  
  

  function getTextAfterAtSymbol(url:string) {
    const atIndex = url.indexOf('%40');
    if (atIndex === -1) {
        return ''; 
    }
    console.log(url.substring(atIndex + 3));
    
    return url.substring(atIndex + 3);
}

const fetchContent = async () => {
  try {
    const response = await fetch(
     `${apiLinks.newsletter.fetch}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
  }
};





  

  return (
    <>
    <div className="bg-white min-h-screen flex flex-col text-black">
      <div id="navbar" className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className=" min-h-screen flex-grow overflow-hidden relative">
        <article className={`m-10 transition-all duration-300 ease-in-out ${showComments ? 'w-full lg:w-3/5 xl:w-3/4' : 'w-full'} overflow-y-auto`}>
          <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black leading-tight">
              {parse(article_title)}
            </h1>
            <div className="flex flex-col items-start text-md text-gray-600 mb-8">
              <span className="mr-4">Author: {article_writer}</span>
              <span>Published: {article_date}</span>
            </div>
            <Image
              src={article_image}
              alt="Article image"
              className="object-fit h-auto mb-8 rounded-lg shadow-md"
            />
            <div className="prose prose-xl max-w-none">
              <div className="mb-6 text-lg leading-relaxed">{parse(article_content)}</div>
            </div>
          </div>
        </article>

        <button
          className="fixed bottom-14 right-4 p-2 z-50 transition-colors duration-200"
          onClick={() => setShowComments(!showComments)}
        >
          <Image
            src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
            alt="Comments button"
            className="w-9 h-9 object-fit"
          />
        </button>

        <div
          className={`fixed mt-4 inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
            showComments ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          style={{
            top: `${navbarHeight}px`,
            bottom: `${footerHeight}px`,
            height: `calc(100vh - ${navbarHeight}px)`
          }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Comments</h2>
            <button
              className="text-gray-400 hover:text-white transition-colors duration-200"
              onClick={() => setShowComments(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-hide ">
            <Comments article_id={article_id} />
          </div>
        </div>
      </main>
      <div className="relative z-50">

<Footer/>
</div>
    </div>
   
    </>
  );
};

export default NewsPage;