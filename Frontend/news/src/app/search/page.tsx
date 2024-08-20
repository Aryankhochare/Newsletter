import { notFound } from 'next/navigation';
import Navbar from '@/components/navbarcomp/navbar';
import Link from 'next/link';
import Footer from '@/components/navbarcomp/footer';

export default async function SearchResults({ searchParams }: { searchParams: { q: string } }) {
    const query = searchParams.q;
  
    const fetchResults = async () => {
      try {
        const writerResponse = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/newsletter/search?writer=${query}`);
        const titleResponse = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/newsletter/search?title=${query}`);
        const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/newsletter/search?category=${query}`);
  
        let writerData: any[] = [];
        let titleData: any[] = [];
        let categoryData: any[] = [];
  
        if (writerResponse.ok) {
          const writerText = await writerResponse.text();
          if (writerText !== "No article") {
            writerData = JSON.parse(writerText);
          }
        }
  
        if (titleResponse.ok) {
          const titleText = await titleResponse.text();
          if (titleText !== "No article") {
            titleData = JSON.parse(titleText);
          }
        }

        if (categoryResponse.ok) {
            const categoryText = await categoryResponse.text();
            if (categoryText !== "No article") {
              categoryData = JSON.parse(categoryText);
            }
          }
  
        const combinedResults = [...writerData, ...titleData, ...categoryData];
        const uniqueResults = Array.from(new Set(combinedResults.map(r => r.id)))
          .map(id => combinedResults.find(r => r.id === id));
  
        return uniqueResults;
      } catch (err) {
        console.error('An error occurred while fetching results.', err);
        return [];
      }
    };
  
    const results = await fetchResults();
    const loading = false;
    const error = results.length === 0 ? 'No results found.' : null;
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
    
     
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Results for "{query}"</h1>
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && results.length === 0 && (
              <p className="text-gray-600">No results found for "{query}".</p>
            )}
            {results.map((item, index) => (
              <article key={index} className="mb-8 pb-6 border-b border-gray-200 last:border-b-0">
                <h2 className="font-bold text-2xl mb-2 text-gray-800 hover:text-blue-600 transition-colors">
                  <Link href={`/article/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="text-sm mb-2 text-gray-600">By: {item.userName}</p>
                <p className="text-sm mb-3 text-gray-600">Category: {item.categoryName}</p>
                <div className="flex items-start">
                  <div className="flex-grow pr-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.editorContent.substring(0, 150)}...
                    </p>
                  </div>
                  {item.coverImage && (
                    <div className="flex-shrink-0 ml-4">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-32 h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-3">
                 
                  Posted on: {new Date(item.modifiedDate).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
