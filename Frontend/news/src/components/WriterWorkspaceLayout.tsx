// components/WriterWorkspaceLayout.tsx
import dynamic from 'next/dynamic';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { PenTool } from 'lucide-react';

const QuillEditor = dynamic(() => import('@/components/quilleditor/QuillEditor'), { ssr: false });

interface News {
  news_id: string;
  news_title: string;
  content: string;
}

interface WriterWorkspaceLayoutProps {
  rejected: News[];
  selectedNews: News | null;
  handleEdit: (id: string) => void;
  handleSave: (title: string, content: string) => void;
}

export default function WriterWorkspaceLayout({
  rejected,
  selectedNews,
  handleEdit,
  handleSave,
}: WriterWorkspaceLayoutProps) {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="flex justify-center text-center mt-4">
        <PenTool className="mr-2 h-8 w-8" />
        <span className="text-2xl text-center font-bold">Writer Workspace</span>
      </div>
      <div className="w-full container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full lg:w-full flex flex-col lg:flex-row">
          {/* Left Sidebar */}
          <div className="w-full mr-1 lg:w-1/2 bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Article Status</h2>
            <div className="flex flex-col gap-4">
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => handleEdit(e.target.value)}
              >
                <option value=''>Rejected Articles</option>
                {rejected.map((unv) => (
                  <option key={unv.news_id} value={unv.news_id}>
                    {unv.news_title}
                  </option>
                ))}
              </select>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option>Articles on Review</option>
                {/* Add options for articles on review */}
              </select>
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option>Articles Posted</option>
                {/* Add options for articles posted */}
              </select>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="w-full lg:w-full bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Article Content</h2>
            <div className="flex-grow w-full h-full">
              {selectedNews ? (
                <QuillEditor 
                  initialContent={selectedNews.content} 
                  initialTitle={selectedNews.news_title} 
                  onSave={handleSave} 
                />
              ) : (
                <QuillEditor 
                  initialContent="" 
                  initialTitle="" 
                  onSave={handleSave} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
