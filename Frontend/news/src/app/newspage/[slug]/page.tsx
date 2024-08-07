// "use client"
// import React from 'react';
// import Navbar from '@/components/navbar';
// import Comments from '@/components/Comments';


// interface NewsPageProps {
//   params: { slug: string };
// }

// const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
//   const { slug } = params;

//   return (
//     <div className="bg-gray-100 min-h-screen">
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
//             src='https://i.postimg.cc/VkfFzQ2v/image.png' 
//             alt='Article image' 
//             className='w-full h-auto mb-8 rounded-lg shadow-md'
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
//             <Comments/>
//           </div>
//         </div>
//       </article>
//     </div>
//   );
// }

// export default NewsPage;

"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Comments from '@/components/Comments';

interface NewsPageProps {
  params: { slug: string };
}

const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
  const { slug } = params;
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <Navbar />
      <article className="max-w-5xl mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Two Centuries Later, a Female Composer Is Rediscovered
          </h1>
          <div className="flex items-center text-lg text-gray-600 mb-8">
            <span className="mr-4">By John Doe</span>
            <span>Published on August 6, 2024</span>
          </div>
          <img
            src="https://i.postimg.cc/VkfFzQ2v/image.png"
            alt="Article image"
            className="w-full h-auto mb-8 rounded-lg shadow-md"
          />
          <div className="prose prose-xl max-w-none">
            <p className="mb-6 text-xl leading-relaxed">
              "A secret appointment exists between past generations and our own," Walter Benjamin wrote. 
              "Our arrival on earth was expected." At pivotal moments, the philosopher argued, voices from 
              the past reach out to us with prophetic force.
            </p>
            <p className="mb-6 text-xl leading-relaxed">
              To review Biden's proposals, though, is to be reminded of why reforming the Court is so hard,
              despite the dissatisfaction and a wealth of ideas. He proposed three measures, 
              the first of which is not so much a reform as a rebuke: the "No One Is Above the Law Amendment" to the Constitution. 
              It would effectively overrule the Court's decision, in Trump v. United States, dangerously asserting that former Presidents 
              have broad immunity from criminal prosecution for their actions in office. But any amendment requires first a two-thirds majority in each house of Congress, 
              and then ratification by three-quarters of the states—thirty-eight in all, a big number. Alternatively, two-thirds of the state legislatures could demand a 
              constitutional convention, which might put the entire document up for grabs. This has never happened, and could be calamitous in a time of Trumpism.
            </p>
            <p className="mb-6 text-xl leading-relaxed">
              The rediscovery of this female composer's work sheds new light on the musical landscape of 
              two centuries ago, challenging our understanding of gender roles in classical music composition.
            </p>
          </div>
        </div>
      </article>
      <button
        className="fixed bottom-4 right-4 p-2 z-50"
        onClick={() => setShowComments(!showComments)}
      >
        <img
          src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
          alt="Comments button"
          className="w-12 h-12"
        />
      </button>
      {showComments && (
        <div className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-lg z-40">
          <Comments />
        </div>
      )}
    </div>
  );
};

export default NewsPage;
