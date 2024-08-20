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
      <div className="flex flex-col min-h-screen bg-gray-100">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Articles by {writer}</h1>
            {Object.keys(articlesByCategory).map((category) => (
              <section key={category} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">{category}</h2>
                <div className="space-y-8">
                  {articlesByCategory[category].map((article: any, index: number) => (
                    <article key={index} className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">{article.title}</h3>
                        <p className="text-gray-700 mb-3">
                          {article.editorContent.substring(0, 150)}...
                        </p>
                        <div className="text-sm text-gray-500">
                          Posted on: {new Date(article.modifiedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error fetching writer data:', error);
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Error fetching writer data. Please try again.</p>
      </div>
    );
  }
}