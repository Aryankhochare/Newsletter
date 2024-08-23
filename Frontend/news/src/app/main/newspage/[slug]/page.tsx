"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbarcomp/navbar";
import Footer from "@/components/navbarcomp/footer";
import { useMainStore } from "@/components/ArticleStore";
import Comments from "@/components/Comments";
import { parseISO, format } from "date-fns";
import parse from "html-react-parser";
import { useParams } from "next/navigation";
import { apiLinks } from "@/utils/constants";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsPageProps {
  params: { slug: string };
}

type UserNews = {
  id: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  editorContent: string;
  postedOn: string;
  modifiedOn: string;
  coverImage: string;
  isVerified: boolean;
  isRejected: boolean;
};

const NewsPageSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-white shadow-xl rounded-lg">
    <Skeleton className="h-8 sm:h-10 md:h-12 w-3/4 mb-4 sm:mb-6" />
    <div className="flex flex-col items-start mb-6 sm:mb-8">
      <Skeleton className="h-3 sm:h-4 w-1/4 mb-2" />
      <Skeleton className="h-3 sm:h-4 w-1/3" />
    </div>
    <Skeleton className="h-48 sm:h-56 md:h-64 w-full mb-6 sm:mb-8" />
    <div className="space-y-3 sm:space-y-4">
      <Skeleton className="h-3 sm:h-4 w-full" />
      <Skeleton className="h-3 sm:h-4 w-full" />
      <Skeleton className="h-3 sm:h-4 w-3/4" />
    </div>
  </div>
);

const NewsPage: React.FC<NewsPageProps> = ({ params }) => {
  const { slug } = params;
  const [fallback, setFallback] = useState<UserNews[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const article_id = useMainStore((state) => state.id);
  const article_title = useMainStore((state) => state.title);
  const article_content = useMainStore((state) => state.editorContent);
  const article_image = useMainStore((state) => state.coverImage);
  const article_writer = useMainStore((state) => state.userName);
  const article_date = useMainStore((state) => state.postedOn);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${apiLinks.newsletter.fetch}`, {
        cache: "no-store",
      });
      const data = await response.json();
      setFallback(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching content:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    const updateHeights = () => {
      const navbar = document.getElementById("navbar");
      const footer = document.getElementById("footer");
      if (navbar) setNavbarHeight(navbar.offsetHeight);
      if (footer) setFooterHeight(footer.offsetHeight);
    };

    window.addEventListener("resize", updateHeights);
    updateHeights();

    return () => window.removeEventListener("resize", updateHeights);
  }, []);

  const urlParams = useParams();
  const url = urlParams.slug as string;

  function extractSlugFromUrl(url: string | undefined): string {
    if (!url) return "";
    if (url.length <= 36) return url;
    return url.slice(-36);
  }

  const newUrl = extractSlugFromUrl(url);
  const fallbackArticle = fallback.find((article) => article.id === newUrl);

  const isArticleAvailable = article_id && article_id.trim() !== "";
  const title = isArticleAvailable
    ? article_title
    : fallbackArticle?.title || "Title not available";
  const content = isArticleAvailable
    ? article_content
    : fallbackArticle?.editorContent || "Content not available";
  const image = isArticleAvailable
    ? article_image
    : fallbackArticle?.coverImage || "";
  const writer = isArticleAvailable
    ? article_writer
    : fallbackArticle?.userName || "Unknown Author";
  const date = isArticleAvailable
    ? article_date
    : fallbackArticle?.postedOn || "";

  return (
    <>
      <div className="bg-white min-h-screen flex flex-col text-black">
        <div id="navbar" className="sticky top-0 z-50">
          <Navbar />
        </div>
        <main className="min-h-screen flex-grow overflow-hidden relative">
          <article
            className={`m-2 sm:m-4 md:m-6 lg:m-10 transition-all duration-300 ease-in-out ${
              showComments ? "w-full lg:w-3/5 xl:w-3/4" : "w-full"
            } overflow-y-auto`}
          >
            {isLoading ? (
              <NewsPageSkeleton />
            ) : (
              <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-white shadow-xl rounded-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-black leading-tight">
                  {parse(title)}
                </h1>
                <div className="flex flex-col items-start text-sm sm:text-md text-gray-600 mb-6 sm:mb-8">
                  <span className="mr-4">Author: {writer}</span>
                  <span>
                    Published:{" "}
                    {date
                      ? format(parseISO(date), "MMMM d, yyyy")
                      : "Date not available"}
                  </span>
                </div>
                {image && (
                  <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 mb-6 sm:mb-8">
                    <Image
                      src={image}
                      alt="Article image"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                  <div className="mb-6 leading-relaxed">{parse(content)}</div>
                </div>
              </div>
            )}
          </article>
          <button
            className="fixed bottom-14 right-4 p-2 z-50 transition-colors duration-200"
            onClick={() => setShowComments(!showComments)}
          >
            <Image
              src="https://i.postimg.cc/HkQpPgZZ/icongrey-removebg-preview.png"
              alt="Comments button"
              width={36}
              height={36}
              className="object-contain"
            />
          </button>
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-lg z-40 transition-transform duration-300 ease-in-out transform ${
              showComments ? "translate-x-0" : "translate-x-full"
            } flex flex-col`}
            style={{
              top: `${navbarHeight}px`,
              bottom: `${footerHeight}px`,
              height: `calc(100vh - ${navbarHeight + footerHeight}px)`,
            }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg sm:text-2xl font-bold text-white">
                Comments
              </h2>
              <button
                className="text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setShowComments(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto scrollbar-hide">
              <Comments article_id={article_id} />
            </div>
          </div>
        </main>
        <div id="footer" className="relative z-50">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default NewsPage;
