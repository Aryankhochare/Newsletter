
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
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="bg-gray-200 shadow-xl p-4 mx-6 mt-6 shadow-gray-800 flex-grow">
          <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p>No results found for "{query}".</p>
          )}
          {results.map((item, index) => (
            <div key={index} className="mb-8 pb-4 border-b">
              <h2 className="font-bold text-xl mb-2">
                <Link href={`/article/${item.id}`}>{item.title}</Link>
              </h2>
              <p className="text-sm mb-2">By: {item.userName}</p>
              <p className="text-sm mb-2">Category: {item.categoryName}</p>
              <div className="flex">
                <div className="flex-1 pr-4 text-sm">
                  {item.editorContent.substring(0, 150)}...
                </div>
                {item.coverImage && (
                  <div className="w-1/3 flex items-start">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      width={200}
                      height={150}
                      className="w-full h-auto max-h-24 object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Posted on: {new Date(item.postedOn).toLocaleDateString()} | 
                Modified on: {new Date(item.modifiedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
        <Footer />
      </div>
    );
  }
