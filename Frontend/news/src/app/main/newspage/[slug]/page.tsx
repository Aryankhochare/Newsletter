<<<<<<< HEAD:Frontend/news/src/app/main/newspage/page.tsx
 "use client";
=======
// "use client";

// import React, { useState } from 'react';
// import Navbar from '@/components/navbar';
// import Comments from '@/components/Comments';

// interface NewsPageProps {
//   params: { slug: string };
// }

// const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
//   const { slug } = params;
//   const [showComments, setShowComments] = useState(false);

//   return (
//     <div className="bg-gray-100 min-h-screen relative">
//       <Navbar />
//       <article className="max-w-5xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="p-6 sm:p-10">
//           <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 leading-tight">
//             Two Centuries Later, a Female Composer Is Rediscovered
//           </h1>
//           <div className="flex items-center text-lg text-gray-600 mb-8">
//             <span className="mr-4">By John Doe</span>
//             <span>Published on August 6, 2024</span>
//           </div>
//           <img
//             src="https://i.postimg.cc/VkfFzQ2v/image.png"
//             alt="Article image"
//             className="w-full h-auto mb-8 rounded-lg shadow-md"
//           />
//           <div className="prose prose-xl max-w-none">
//             <p className="mb-6 text-xl leading-relaxed">
//               "A secret appointment exists between past generations and our own," Walter Benjamin wrote. 
//               "Our arrival on earth was expected." At pivotal moments, the philosopher argued, voices from 
//               the past reach out to us with prophetic force.
//             </p>
//             <p className="mb-6 text-xl leading-relaxed">
//               To review Biden's proposals, though, is to be reminded of why reforming the Court is so hard,
//               despite the dissatisfaction and a wealth of ideas. He proposed three measures, 
//               the first of which is not so much a reform as a rebuke: the "No One Is Above the Law Amendment" to the Constitution. 
//               It would effectively overrule the Court's decision, in Trump v. United States, dangerously asserting that former Presidents 
//               have broad immunity from criminal prosecution for their actions in office. But any amendment requires first a two-thirds majority in each house of Congress, 
//               and then ratification by three-quarters of the states—thirty-eight in all, a big number. Alternatively, two-thirds of the state legislatures could demand a 
//               constitutional convention, which might put the entire document up for grabs. This has never happened, and could be calamitous in a time of Trumpism.
//             </p>
//             <p className="mb-6 text-xl leading-relaxed">
//               The rediscovery of this female composer's work sheds new light on the musical landscape of 
//               two centuries ago, challenging our understanding of gender roles in classical music composition.
//             </p>
//           </div>
//         </div>
//       </article>
//       <button
//         className="fixed bottom-4 right-4 p-2 z-50"
//         onClick={() => setShowComments(!showComments)}
//       >
//         <img
//           src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
//           alt="Comments button"
//           className="w-12 h-12"
//         />
//       </button>
//       {showComments && (
//         <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-lg z-40">
//           <Comments />
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewsPage;"use client";

"use client";
>>>>>>> 11b1da35469c4f39715c503c856adcfa97ebb2c6:Frontend/news/src/app/main/newspage/[slug]/page.tsx

import React, { useState } from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { useMainStore } from '@/components/ArticleStore';
import Comments from '@/components/Comments';

interface NewsPageProps {
  params: { slug: string };
}

const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
  const { slug } = params;
  const [showComments, setShowComments] = useState(false);
  const article_id = useMainStore((state) => state.news_id);
  const article_title = useMainStore((state) => state.news_title);
  const article_content = useMainStore((state) => state.content);
  const article_image = useMainStore((state) => state.cover_image);
  //console.log({article_id});
  
  return (
    <div className="bg-white min-h-screen flex flex-col text-black">
      <div className="sticky top-0 z-50">
          <Navbar />
        </div>


      <div className="flex-grow overflow-hidden ">
      <article className={`m-10 transition-all duration-300 ease-in-out ${showComments ? 'w-full lg:w-3/5 xl:w-3/4' : 'w-full'} overflow-y-auto`}>
          <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-black leading-tight">
              {article_title}
            </h1>
            <div className="flex items-center text-lg text-black mb-8">
              <span className="mr-4">By John Doe</span>
              <span>Published on August 6, 2024</span>
            </div>
            <img
              src={article_image}
              alt="Article image"
              className="w-full h-auto mb-8 rounded-lg shadow-md"
            />
            <div className="prose prose-xl max-w-none">
              <p className="mb-6 text-xl leading-relaxed">
              {article_content}
              </p>
            </div>
          </div>
        </article>

        <button
          className="fixed bottom-4 right-4 p-2 z-50 transition-colors duration-200"
          onClick={() => setShowComments(!showComments)}
        >
          <img
            src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
            alt="Comments button"
            className="w-12 h-12"
          />
        </button>

        <div
          className={`fixed mt-4 inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
            showComments ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          style={{ top: 'var(--navbar-height, 64px)' }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Comments</h2>
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
          <div className="flex-grow overflow-y-auto">
          <Comments article_id={article_id} />
          </div>
        </div>
      </div>
      < div className='bottom-0 pb-0 mb-0 bg-black'>
      <Footer/>
    </div>
        
    </div>
  );
};

export default NewsPage;
