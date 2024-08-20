import dynamic from 'next/dynamic';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import BackButton from '@/components/BackButton';

const ArticleContent = dynamic(() => import('@/components/ArticleContent'), { ssr: false });

export default function ReadingPage() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col text-gray-800">
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </div>
      <div className="flex-grow p-6 md:p-12 relative">
        <div className="absolute top-0 left-4 md:top-8 md:left-8">
          <BackButton />
        </div>
        <article className="transition-all duration-300 ease-in-out overflow-y-auto">
          <ArticleContent />
        </article>
      </div>
        <Footer />
      
    </div>
  );
}
