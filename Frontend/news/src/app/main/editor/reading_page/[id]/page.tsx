import dynamic from 'next/dynamic';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import BackButton from '@/components/BackButton';

const ArticleContent = dynamic(() => import('@/components/ArticleContent'), { ssr: false });

export default function ReadingPage() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col text-gray-800">
      {/* Navbar */}
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </div>
      
      {/* Main Content */}
      <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 relative">
        {/* Back Button */}
        <div className="absolute top-0 left-2 sm:top-0 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8">
          <BackButton />
        </div>
        
        {/* Article Content */}
        <article className="transition-all duration-300 ease-in-out overflow-y-auto text-sm sm:text-base md:text-lg lg:text-xl">
          <ArticleContent />
        </article>
      </div>
      
      <Footer/>
     </div>
  );
}
