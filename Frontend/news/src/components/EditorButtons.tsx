// "use client";
// import { useState } from "react";
// import { Button } from "./ui/button";
// import { useArticleStore } from "@/app/ArticleStore";
// import { Badge } from "./ui/badge";
// import { useRouter } from "next/navigation";
// import { FiTrash2 } from "react-icons/fi";

// interface News {
//   id: string;
//   userId: string;
//   userName: string;
//   categoryId: string;
//   categoryName: string;
//   title: string;
//   editorContent: string;
//   postedOn: Date | null;
//   modifiedOn: Date | null;
//   isVerified: boolean;
//   isRejected: boolean;
//   coverImage: string;
// }

// function EditorButtons({ Data }: { Data: News[] }) {
//   const [articles, setArticles] = useState<News[]>(Data);
//   const [loading, setLoading] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [feedback, setFeedback] = useState("");
//   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
//   const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
//   const send_article = useArticleStore((state) => state.setArticle);
//   const router = useRouter();



//   const handleVerify = async (id: string) => {
//     try {
//       setLoading(true);
//       await fetch(
//         `${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/verify/${id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ id }),
//         }
//       );

//       setArticles((prevArticles) =>
//         prevArticles.map((article) =>
//           article.id === id
//             ? { ...article, isVerified: true, isRejected: false }
//             : article
//         )
//       );
//     } catch (error) {
//       console.error("Error verifying content:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReject = async (id: string) => {
//     setCurrentArticleId(id);
//     setShowFeedbackDialog(true);  
//   };

//   const handleSendBackConfirm = async () => {
//     if (currentArticleId) {
//       try {
//         setLoading(true);
//         await fetch(
//           `${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/reject/${currentArticleId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ feedback }),
//           }
//         );

//         setArticles((prevArticles) =>
//           prevArticles.map((article) =>
//             article.id === currentArticleId
//               ? { ...article, isVerified: true, isRejected: true }
//               : article
//           )
//         );
//         setShowFeedbackDialog(false);
//         setFeedback("");
//         setCurrentArticleId(null);
//       } catch (error) {
//         console.error("Error rejecting content:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       setLoading(true);
//       await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       setArticles((prevArticles) =>
//         prevArticles.filter((article) => article.id !== id)
//       );
//     } catch (error) {
//       console.error("Error deleting content:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTitleClick = (id: string) => {
//     const article_content = articles.find((e) => e.id == id);
//     if (article_content) {
//       send_article(article_content);
//       router.push("/editor/reading_page");
//     } else {
//       console.log("No content found !");
//     }
//   };

//   // Filtering based on status selection
//   const filteredArticles = articles.filter((article) => {
//     let status = "Pending";
//     if (article.isVerified) {
//       status = article.isRejected ? "Rejected" : "Approved";
//     }
//     const matchesSelectedStatus =
//       selectedStatus === "all" ||
//       status.toLowerCase() === selectedStatus.toLowerCase();
//     return matchesSelectedStatus;
//   });

//   return (
//     <div className="container grid px-4 py-8 md:px-0 md:py-12">
//       <div className="bg-gradient-to-r from-black via-gray-800 to-black p-4 shadow-lg">
//         <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
//           <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 md:mb-0">
//             Post Requests
//           </h1>
//           <div className="relative">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="pl-1 pr-3 py-2 rounded border-none bg-slate-100 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-indigo-200"
//             >
//               <option value="all">Status</option>
//               <option value="approved">Approved</option>
//               <option value="rejected">Rejected</option>
//               <option value="pending">Pending</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto mt-4">
//         <table className="w-full min-w-full table-auto">
//           <thead className="hidden md:table-header-group">
//             <tr className="bg-muted text-muted-foreground">
//               <th className="px-4 py-2 text-left text-sm md:text-base font-medium">
//                 Title
//               </th>
//               <th className="px-4 py-2 text-left text-sm md:text-base font-medium">
//                 Status
//               </th>
//               <th className="px-4 py-2 text-right text-sm md:text-base font-medium">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={3}
//                   className="text-center py-4 text-sm md:text-base"
//                 >
//                   Loading...
//                 </td>
//               </tr>
//             ) : filteredArticles.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={3}
//                   className="text-center py-4 text-sm md:text-base"
//                 >
//                   No articles found
//                 </td>
//               </tr>
//             ) : (
//               filteredArticles.map((article) => {
//                 let status = "Pending";
//                 if (article.isVerified) {
//                   status = article.isRejected ? "Rejected" : "Approved";
//                 }

//                 return (
//                   <tr key={article.id} className="border-b md:table-row">
//                     <td
//                       className="px-4 py-2 cursor-pointer text-sm md:text-base"
//                       onClick={() => handleTitleClick(article.id)}
//                     >
//                       <div className="font-medium">{article.title}</div>
//                     </td>
//                     <td className="px-4 py-2 text-sm md:text-base">
//                       <Badge
//                         variant="outline"
//                         className={
//                           status === "Approved"
//                             ? "bg-green-500 text-green-50"
//                             : status === "Rejected"
//                             ? "bg-red-500 text-red-50"
//                             : "bg-yellow-500 text-yellow-50"
//                         }
//                       >
//                         {status}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-2 text-right text-sm md:text-base">
//                       <div className="flex justify-end gap-2">
//                         {!article.isVerified && (
//                           <>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleVerify(article.id)}
//                             >
//                               Approve
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleReject(article.id)}
//                             >
//                               Sendback
//                             </Button>
//                           </>
//                         )}
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDelete(article.id)}
//                           className="text-red-600"
//                         >
//                           <FiTrash2 />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Feedback Dialog */}
//       {showFeedbackDialog && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Send Back Feedback</h2>
//             <textarea
//               className="w-full p-2 border rounded"
//               rows={4}
//               placeholder="Enter your feedback here..."
//               value={feedback}
//               onChange={(e) => setFeedback(e.target.value)}
//             />
//             <div className="flex justify-end mt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowFeedbackDialog(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 className="ml-2"
//                 onClick={handleSendBackConfirm}
//               >
//                 Send Back
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default EditorButtons;


"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useArticleStore } from "@/app/ArticleStore";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";

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
  const [articles, setArticles] = useState<News[]>(Data || []);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const send_article = useArticleStore((state) => state.setArticle);
  const router = useRouter();

  console.log("Initial Data:", Data);
  console.log("Articles State:", articles);

  const handleVerify = async (id: string) => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error verifying content:", error);
    } finally {
      setLoading(false);
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
        await fetch(
          `${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/reject/${currentArticleId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ feedback }),
          }
        );

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
    try {
      setLoading(true);
      await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/editor/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.id !== id)
      );
    } catch (error) {
      console.error("Error deleting content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (id: string) => {
    const article_content = articles.find((e) => e.id == id);
    if (article_content) {
      send_article(article_content);
      router.push("/main/editor/reading_page");
    } else {
      console.log("No content found !");
    }
  };

  // Filtering based on status selection
  const filteredArticles = articles.filter((article) => {
    let status = "Pending";
    if (article.isVerified) {
      status = article.isRejected ? "Rejected" : "Approved";
    }
    console.log("Article Status:", status);
    return (
      selectedStatus === "all" ||
      status.toLowerCase() === selectedStatus.toLowerCase()
    );
  });

  console.log("Filtered Articles:", filteredArticles);

  return (
    <div className="container grid px-4 py-8 md:px-0 md:py-12">
      <div className="bg-gradient-to-r from-black via-gray-800 to-black p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 md:mb-0">
            Post Requests
          </h1>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-1 pr-3 py-2 rounded border-none bg-slate-100 text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-indigo-200"
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
              <th className="px-4 py-2 text-right text-sm md:text-base font-medium">
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
              filteredArticles.map((article) => {
                let status = "Pending";
                if (article.isVerified) {
                  status = article.isRejected ? "Rejected" : "Approved";
                }

                return (
                  <tr key={article.id} className="border-b md:table-row">
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
                    <td className="px-4 py-2 text-right text-sm md:text-base">
                      <div className="flex justify-end gap-2">
                        {!article.isVerified && (
                          <>
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
                              Sendback
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
              >
                Cancel
              </Button>
              <Button
                className="ml-2"
                onClick={handleSendBackConfirm}
                disabled={loading}
              >
                Send Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorButtons;
