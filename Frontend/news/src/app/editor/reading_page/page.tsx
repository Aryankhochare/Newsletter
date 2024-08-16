"use client";

import { useArticleStore } from "@/app/ArticleStore";
import parse from "html-react-parser";

export default function ReadingPage() {
  const article_content = useArticleStore((state) => state.editorContent);
  const article_title = useArticleStore((state) => state.title);
  return (
    <>
      <h1>{parse(article_title)}</h1>
      <div>{parse(article_content)}</div>
    </>
  );
}
