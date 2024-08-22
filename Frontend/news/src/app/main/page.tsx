import React from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import TrendingCarousel from '@/components/TrendingCarousel';
import LatestNewsCarousel from '@/components/LatestNewsCarousel';

async function getArticles() {
  try {
    const response = await fetch(`https://globalbuzz.azurewebsites.net/newsletter/verified`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-grow">
        <section className="mb-12">
          <TrendingCarousel articles_={articles} />
        </section>

        <section className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest News</h2>
          <LatestNewsCarousel articles_={articles} />
        </section>
      </main>
      <Footer />
    </div>
  );
}