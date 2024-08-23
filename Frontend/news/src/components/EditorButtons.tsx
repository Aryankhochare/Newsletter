"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useArticleStore } from "./ArticleStore";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { apiLinks } from "@/utils/constants";
import { toast, Toaster } from "sonner";

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
  const [articles, setArticles] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const send_article = useArticleStore((state) => state.setArticle);
  const router = useRouter();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const session = useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(Data || []);
      setLoading(false);
    }, 2000); // Simulated loading delay

    return () => clearTimeout(timer);
  }, [Data]);

  const handleVerify = async (id: string) => {
    setCurrentArticleId(id);
    setShowApproveDialog(true);
  };

  const handleVerifyConfirm = async () => {
    if (currentArticleId) {
      try {
        setLoading(true);
        if (!session.data?.accessToken) return;
        await fetch(`${apiLinks.editor.verify}/${currentArticleId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentArticleId,
            from: session.data?.accessToken,
          }),
        });

        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === currentArticleId
              ? { ...article, isVerified: true, isRejected: false }
              : article
          )
        );
      } catch (error) {
        console.error("Error verifying content:", error);
      } finally {
        setLoading(false);
        setShowApproveDialog(false);
        setCurrentArticleId(null);
      }
    }
  };

  const handleReject = async (id: string) => {
    setCurrentArticleId(id);
    setShowFeedbackDialog(true);
  };

  const handleSendBackConfirm = async () => {
    if (currentArticleId) {
      try {
        setLoading(true);
        await fetch(`${apiLinks.editor.reject}/${currentArticleId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentArticleId,
            message: feedback,
            from: session.data?.accessToken,
          }),
        });

        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === currentArticleId
              ? { ...article, isVerified: true, isRejected: true }
              : article
          )
        );
        setShowFeedbackDialog(false);
        setFeedback("");
        setCurrentArticleId(null);
      } catch (error) {
        console.error("Error rejecting content:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setCurrentArticleId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (currentArticleId) {
      try {
        setLoading(true);
        await fetch(`${apiLinks.editor.delete}/${currentArticleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== currentArticleId)
        );
      } catch (error) {
        console.error("Error deleting content:", error);
      } finally {
        setLoading(false);
        setShowDeleteDialog(false);
        setCurrentArticleId(null);
      }
    }
  };

  const handleTitleClick = (id: string) => {
    const article_content = articles.find((e) => e.id == id);
    if (article_content) {
      send_article(article_content);
      router.push(`/main/editor/reading_page/${id}`);
    } else {
      console.log("No content found !");
    }
  };

  const filteredArticles = articles.filter((article) => {
    let status = "Pending";
    if (article.isVerified) {
      status = article.isRejected ? "Rejected" : "Approved";
    }
    return (
      selectedStatus === "all" ||
      status.toLowerCase() === selectedStatus.toLowerCase()
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-black via-gray-800 to-black p-4 shadow-lg rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 sm:mb-0">
            Post Requests
          </h1>
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto pl-2 pr-3 py-2 rounded border-none bg-slate-100 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-indigo-200"
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
        <table className="w-full min-w-full table-auto border-collapse">
          <thead className="hidden sm:table-header-group">
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-2 text-left text-sm sm:text-base font-medium">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm sm:text-base font-medium">
                Status
              </th>
              <th className="px-4 py-2 text-right text-sm sm:text-base font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <Skeleton className="h-4 w-3/4" />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton className="h-6 w-20" />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))
            ) : filteredArticles.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-4 text-sm sm:text-base"
                >
                  No articles found
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => {
                let status = "Pending";
                if (article.isVerified) {
                  status = article.isRejected ? "Rejected" : "Approved";
                }

                return (
                  <tr key={article.id} className="border-b">
                    <td
                      className="px-4 py-2 cursor-pointer text-sm sm:text-base"
                      onClick={() => handleTitleClick(article.id)}
                    >
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className="px-4 py-2 text-sm sm:text-base">
                      <Badge
                        variant="outline"
                        className={`${
                          status === "Approved"
                            ? "bg-green-500 text-green-50"
                            : status === "Rejected"
                            ? "bg-red-500 text-red-50"
                            : "bg-yellow-500 text-yellow-50"
                        } inline-block`}
                      >
                        {status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-right text-sm sm:text-base">
                      <div className="flex flex-col sm:flex-row justify-end gap-2">
                        {!article.isVerified && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(article.id)}
                              className="w-full sm:w-auto"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(article.id)}
                              className="w-full sm:w-auto"
                            >
                              Sendback
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 w-full sm:w-auto"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Dialog */}
      {showFeedbackDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Send Back Feedback</h2>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <div>
                <Toaster />
                <Button
                  onClick={() => {
                    handleSendBackConfirm();
                    toast("Feedback Sent!");
                  }}
                  disabled={loading}
                >
                  Send Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      {showApproveDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Approval</h2>
            <p>Do you want to approve this article?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setShowApproveDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <div>
                <Toaster />
                <Button
                  onClick={() => {
                    handleVerifyConfirm();
                    toast("Approved!");
                  }}
                  disabled={loading}
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Do you want to delete this article?</p>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <div>
                <Toaster />
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => {
                    handleDeleteConfirm();
                    toast("Deleted!");
                  }}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorButtons;
