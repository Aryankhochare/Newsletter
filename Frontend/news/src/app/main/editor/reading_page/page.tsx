import dynamic from 'next/dynamic';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';

const ArticleContent = dynamic(() => import('@/components/ArticleContent'), { ssr: false });

export default function ReadingPage() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen flex flex-col text-gray-800">
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar />
      </div>

      <div className="flex-grow overflow-hidden p-6 md:p-12">
        <article className="transition-all duration-300 ease-in-out overflow-y-auto">
          <ArticleContent />
        </article>
      </div>

      <div className='bottom-0 pb-0 mb-0 bg-gray-900'>
        <Footer />
      </div>
    </div>
  );
}
