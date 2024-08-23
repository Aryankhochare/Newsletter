import { notFound } from 'next/navigation';
import Navbar from '@/components/navbarcomp/navbar';
import Link from 'next/link';
import Footer from '@/components/navbarcomp/footer';
import { apiLinks } from '@/utils/constants';
import Image from 'next/image';
import parse from 'html-react-parser'
import SearchResultsClient from '@/components/navbarcomp/SearchResultsClient';

export const revalidate = 0;

    const fetchResults = async (query : string) => {
      try {
        const writerResponse = await fetch(`${apiLinks.newsletter.searchWriter}${query}`);
        const titleResponse = await fetch(`${apiLinks.newsletter.searchTitle}${query}`);
        const categoryResponse = await fetch(`${apiLinks.newsletter.searchCategory}${query}`);
  
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
}


export default async function SearchResults({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;
  const results = await fetchResults(query);
  const error = results.length === 0 ? 'No results found.' : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow container mx-auto px-4 py-8">
        <SearchResultsClient query={query} results={results} error={error} />
      </main>
      <Footer />
    </div>
  );
}

