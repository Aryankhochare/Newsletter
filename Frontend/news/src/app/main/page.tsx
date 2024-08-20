import React from 'react';
import Navbar from '@/components/navbarcomp/navbar';
import Footer from '@/components/navbarcomp/footer';
import { supabase } from '@/app/api/auth/[...nextauth]/route';
import TrendingCarousel from '@/components/TrendingCarousel';
import LatestNewsCarousel from '@/components/LatestNewsCarousel';

interface Category {
  category_name: string;
}

interface Article {
  news_id: string;
  category_id: string;
  news_title: string;
  content: string;
  posted_on: string;
  modified_on: string;
  cover_image: string;
  is_verified: boolean;
  is_rejected: boolean;
  Category: Category;
}

async function getArticles() {
  try {
    const { data, error } = await supabase.from('News').select(`
      *,
      Category (
        category_name
      )
    `).eq('is_verified', true).eq('is_rejected', false).order('posted_on', { ascending: false });

    if (error) throw error;

    return data.map((article: Article) => ({
      ...article,
      posted_on: new Date(article.posted_on).toLocaleDateString(),
    }));
  } catch (error) {
    console.log(error);
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
          <TrendingCarousel articles={articles} />
        </section>

        <section className="container mx-auto px-4 mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest News</h2>
          <LatestNewsCarousel articles={articles} />
        </section>
      </main>
      <Footer/>
    </div>
  );
}