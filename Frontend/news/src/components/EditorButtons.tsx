"use client";
import { revalidatePath } from "next/cache";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useArticleStore } from "@/app/ArticleStore";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

interface News {
  id: string;
  userId: string;
  userName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  editorContent: string;
  postedOn: Date | null;
  modifiedOn: Date | null;
  isVerified: boolean;
  isRejected: boolean;
  coverImage: string;
}

function EditorButtons({ Data }: { Data: News[] }) {
  const [articles, setArticles] = useState<News[]>(Data);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const send_article = useArticleStore((state) => state.setArticle);
  const router = useRouter();

  const handleVerify = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/verify/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === id
            ? { ...article, isVerified: true, isRejected: false }
            : article
        )
      );

      router.refresh();
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/reject/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === id
            ? { ...article, isVerified: true, isRejected: true }
            : article
        )
      );


      router.refresh();
    } catch (error) {
      console.error("Error rejecting content:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  // search query
  const filteredArticles = articles.filter((article) => {
    let status = "Pending";
    if (article.isVerified) {
      status = article.isRejected ? "Rejected" : "Approved";
    }
    const matchesSelectedStatus =
      selectedStatus === "all" ||
      status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSelectedStatus;
  });

  const handleTitleClick = (id: string) => {
    const article_content = articles.find((e) => e.id == id);
    if (article_content) {
      send_article(article_content);
      router.push("/editor/reading_page");
    } else {
      console.log("No content found !");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="bg-gradient-to-r from-black via-gray-800 to-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 md:mb-0">
            Post Requests
          </h1>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-full border-none bg-white text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-full table-auto">
          <thead className="hidden md:table-header-group">
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-2 text-left text-sm md:text-base font-medium">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm md:text-base font-medium">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm md:text-base font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-sm md:text-base"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredArticles.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-sm md:text-base"
                >
                  No articles found
                </td>
              </tr>
            ) : (
              filteredArticles.map((article, index) => {
                let status = "Pending";
                if (article.isVerified) {
                  status = article.isRejected ? "Rejected" : "Approved";
                }

                return (
                  <tr key={index} className="border-b md:table-row">
                    <td
                      className="px-4 py-2 cursor-pointer text-sm md:text-base"
                      onClick={() => handleTitleClick(article.id)}
                    >
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className="px-4 py-2 text-sm md:text-base">
                      <Badge
                        variant="outline"
                        className={
                          status === "Approved"
                            ? "bg-green-500 text-green-50"
                            : status === "Rejected"
                            ? "bg-red-500 text-red-50"
                            : "bg-yellow-500 text-yellow-50"
                        }
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 flex flex-col gap-2 text-sm md:text-base md:flex-row">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(article.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(article.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
                      >
                        Send Back
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditorButtons;
