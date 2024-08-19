"use client";

import { useArticleStore } from "@/components/ArticleStore";
import BackButton from "@/components/BackButton";
import parse from "html-react-parser";

export default function ReadingPage() {
  const article_content = useArticleStore((state) => state.editorContent);
  const article_title = useArticleStore((state) => state.title);
  return (
    <>
     
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <BackButton />
    <article className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200">
      <div className="p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6 font-serif leading-tight">
          {article_title ? parse(article_title) : 'No title available'}
        </h1>
        <div className="prose prose-lg max-w-none text-gray-800 font-sans leading-relaxed">
          {article_content ? parse(article_content) : 'No content available'}
        </div>
      </div>
    </article>
  </div>
</div>
    </>
  );
}
