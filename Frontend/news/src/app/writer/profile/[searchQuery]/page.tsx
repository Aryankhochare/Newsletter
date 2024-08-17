import { notFound } from 'next/navigation';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';

export default async function Page({ params }: { params: { searchQuery: string } }) {
  const { searchQuery } = params;

  const fetchContent = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ASP_NET_URL}/newsletter/search?writer=${searchQuery}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  };

  try {
    const writerData = await fetchContent();

    if (!writerData || (Array.isArray(writerData) && writerData.length === 0)) {
      notFound();
    }

    const writer = Array.isArray(writerData) ? writerData[0].writer : writerData.writer;
    const articlesByCategory = writerData.reduce((acc: any, article: any) => {
      if (!acc[article.categoryName]) {
        acc[article.categoryName] = [];
      }
      acc[article.categoryName].push(article);
      return acc;
    }, {});

    return (
      <div className=" ">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className='bg-gray-200 shadow-xl p-4 mx-6 mt-6 shadow-gray-800'>
          {Object.keys(articlesByCategory).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 underline italic text-gray-800 ml-4">{category}</h2>
              <div className="flex flex-grow overflow-hidden">
                <div className="flex-grow scrollbar-hide md:w-7/10 overflow-y-auto p-4 md:mx-16 md:m-4">
                  {articlesByCategory[category].map((article: any, index: number) => (
                    <div key={index} className="mb-8 pb-4 border-b">
                      <h2 className="font-bold text-xl mb-2 ml-0">{article.title}</h2>
                      <div className="flex">
                        <div className="flex-1 pr-4 text-sm">
                          {article.editorContent.substring(0, 150)}...
                        </div>
                        <div className="w-1/3 flex items-start">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            width={200}
                            height={150}
                            className="w-full h-auto max-h-24 object-cover"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Posted on: {new Date(article.postedOn).toLocaleDateString()} | Modified on: {new Date(article.modifiedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-t border-gray-500 my-4" />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching writer data:', error);
    return <div className="container mx-auto p-4 text-red-500">Error fetching writer data. Please try again.</div>;
  }
}
