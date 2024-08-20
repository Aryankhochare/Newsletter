// 'use client'
// import Navbar from "@/components/navbarcomp/navbar";
// import Footer from "@/components/navbarcomp/footer";
// import BackButton from "@/components/BackButton";
// import {useState} from 'react'
// export default function Page({ params }: { params: { id:string } }) {
//   const article_content = "dfsgf";
//   const [article,setArticle] =useState(null)
//   const cover_image = "dfsgf";
//   const showFeedback = "";
//   const feedback = "";

//   fetch("https://globalbuzz.azurewebsites.net/newsletter")
//     .then((d) => d.json())
//     .then((d) => {
//         setArticle(d.filter((article) => article.id === params.id)[0])
//     });
//   return (
//     <>
//       <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col text-gray-800">
//         <div className="sticky top-0 z-50 shadow-md">
//           <Navbar />
//         </div>
//         <div className="flex-grow p-6 md:p-12 relative">
//           <div className="absolute top-0 left-4 md:top-8 md:left-8">
//             <BackButton />
//           </div>
//           <article className="transition-all duration-300 ease-in-out overflow-y-auto">
//             <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
//               <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900 leading-tight">
//                 {article&&article.title}
//               </h1>
//               <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700">
//               {article&&article.editorContent}
//               </div>
//               <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 flex items-center justify-center">
//                 <img src={article&&article.coverImage} alt="Cover Image" className="max-w-full h-auto" />
//               </div>
//             </div>
//             <div className="mt-12 flex justify-center space-x-6">
//               <button className="bg-green-500 text-white px-4 py-2 rounded-full">
//                 Accept
//               </button>
//               <button className="bg-red-500 text-white px-4 py-2 rounded-full">
//                 Reject
//               </button>
//               <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200">
//                 Fact Check
//               </button>
//             </div>

//             <div
//               className={`fixed mt-4 inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-2xl z-40 transition-transform duration-300 ease-in-out transform ${
//                 false ? "translate-x-0" : "translate-x-full"
//               } flex flex-col`}
//               style={{ top: "var(--navbar-height, 64px)" }}
//             >
//               <div className="flex justify-between items-center p-6 border-b border-gray-700">
//                 <h2 className="text-2xl font-bold text-white">Fact checking</h2>
//                 {/* <button
//             className="text-gray-400 hover:text-white transition-colors duration-200"
//             onClick={() => setShowFeedback(false)}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button> */}
//               </div>
//               {/* <div className="flex-grow overflow-y-auto p-6">
//           <textarea
//             className="w-full h-64 p-4 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//             placeholder=""
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//           ></textarea>
          
//         </div> */}
//             </div>
//           </article>
//         </div>
//         <div className="bottom-0 pb-0 mb-0 bg-gray-900">
//           <Footer />
//         </div>
//       </div>
//     </>
//   );
// }
