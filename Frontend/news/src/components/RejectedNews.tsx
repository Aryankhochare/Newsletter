import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/api/auth/[...nextauth]/route';
import QuillEditor from '@/components/QuillEditor';

interface News {
  id: string;
  title: string;
  editorcontent: string;
}

const RejectedNews: React.FC = () => {
  const [rejected, setRejected] = useState<News[]>([]);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const fetchRejected = async () => {
    const { data, error } = await supabase
      .from('NewsTest')
      .select('id, title, editorcontent')
      .eq('is_verified', false)
      .eq('is_rejected', true);

    if (error) {
      console.log('Error fetching rejected news:', error);
    } else {
      setRejected(data || []);
    }
  };

  const handleEdit = (id : string) => {
    const newsItem = rejected.find((item) => item.id === id) || null;
    setSelectedNews(newsItem);

  }

  const handleSave = (title: string, content: string) => {
    console.log('Updated news:', { title, content });
  };

  useEffect(() => {
    fetchRejected();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-center">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Rejected Articles :</h2>
      {rejected.map((unv) => (
        <div key={unv.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{unv.title}</h2>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            onClick={() => handleEdit(unv.id)}
          >
            Click to Edit
          </button>
        </div>
      ))}
      {selectedNews && (
        <div className="mt-8">
          <QuillEditor initialContent={selectedNews.editorcontent} initialTitle={selectedNews.title} onSave={handleSave} />
        </div>
      )}
    </div>
  );
};

export default RejectedNews;