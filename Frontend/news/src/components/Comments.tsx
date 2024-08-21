  // import React, { useState, useEffect } from 'react';
  // import { supabase } from '@/app/api/auth/[...nextauth]/route';

  // interface Comment {
  //   id: number;
  //   body: string;
  //   // author: string;
  //   // createdAt: string;
  // }

  // const Comments: React.FC = () => {
  //   const [comments, setComments] = useState<Comment[]>([]);
  //   const [commentBody, setCommentBody] = useState('');

  //   const fetchComments = async () => {
  //     const { data, error } = await supabase
  //       .from('CommentTest')
  //       .select()

  //     if (error) {
  //       alert("Error fetching comments!");
  //       console.error(error);
  //     } else if (data) {
  //       setComments(data);
  //     }
  //   };

  //   const onComment = async (newComment: Omit<Comment, 'id'>) => {
  //     const { data, error } = await supabase
  //       .from('CommentTest')
  //       .insert([newComment])
  //       .select();

  //     if (error) {
  //       alert("Error posting comment!");
  //       console.error(error);
  //     } else {
  //       fetchComments();
  //     }
  //   };

  //   const handleDelete = async (id: number) => {
  //     const { error } = await supabase
  //       .from('CommentTest')
  //       .delete()
  //       .match({ id });

  //     if (error) {
  //       alert("Error deleting comment!");
  //       console.error(error);
  //     } else {
  //       fetchComments();
  //     }
  //   };

  //   useEffect(() => {
  //     fetchComments();
  //   }, []);

  //   const handleComment = () => {
  //     if (commentBody.trim() !== '') {
  //       onComment({
  //         body: commentBody.trim(),
  //         // author: 'Anonymous',
  //         // createdAt: new Date().toISOString(),
  //       });
  //       setCommentBody('');
  //     }
  //   };

  //   return (
  //     <div className="flex flex-col h-full bg-gray-700 text-white">
  //       <div className="flex-grow overflow-y-auto scrollbar-hide px-4 py-6 space-y-4">
  //         {comments.map((comment) => (
  //           <div key={comment.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
  //             <div className="flex justify-between items-start">
  //               {/* <div>
  //                 <h4 className="font-semibold text-blue-400">{comment.author}</h4>
  //                 <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
  //               </div> */}
  //               <button
  //                 onClick={() => handleDelete(comment.id)}
  //                 className="text-red-500 hover:text-red-700 transition-colors duration-200"
  //               >
  //                 Delete
  //               </button>
  //             </div>
  //             <p className="mt-2 text-gray-300">{comment.body}</p>
  //           </div>
  //         ))}
  //       </div>
  //       <div className="p-4 bg-gray-900">
  //         <textarea
  //           className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           rows={3}
  //           placeholder="Add a comment..."
  //           value={commentBody}
  //           onChange={(e) => setCommentBody(e.target.value)}
  //         />
  //         <button
  //           className="mt-2 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
  //           onClick={handleComment}
  //         >
  //           Post Comment
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default Comments;

  'use client'

  import React, { useState, useEffect } from 'react';

  interface username { //Added this !
    username : string;
  }
  interface Comment {
    comment_id: string;
    user_id: string;
    news_id: string;
    comment: string;
    Users : username; //Added this !
  }

  interface CommentsProps {
    article_id: string;
  }

  const Comments: React.FC<CommentsProps> = ({ article_id }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBody, setCommentBody] = useState('');
    const [userId, getUserId] = useState<string>('');

    const fetchUserId = async () => {
      if (userId == null) return;
      try {
        const response = await fetch(`../../api/comment-route/fetch-user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const userIdFromData = data.userId; 
        getUserId(userIdFromData); 
        console.log(userIdFromData, typeof userIdFromData); 
      } catch (error) {
        console.log("Error fetching comments!", error);
      }
    };

    const fetchComments = async (id: string) => {
      if (!id) return;
      //fetchUserId();
      try {
        const response = await fetch(`../../api/comment-route/fetchComment?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.log("Error fetching comments!", error);
      }
    };

    const onComment = async (id: string, content: string) => {
      if (content == null || content == '')
      {
        alert("No comment has been entered !");
        return;
      }
      try {
        const response = await fetch("../../api/comment-route/insert-comment", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ NewsId: id, Comment: content }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        
        await fetchComments(article_id);
      } catch (error) {
        console.log("Error posting comments!", error);
      }
    };

    const handleDelete = async (id: string) => {
      try {
        const response = await fetch('../../api/comment-route/deleteComment', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not okay');
        }
        
        await fetchComments(article_id);
      } catch (error) {
        console.log("Error deleting comments!", error);
      }
    };

    useEffect(() => {
      fetchUserId();
    }, []);

    // fetchComments(article_id);
    useEffect(() => {
      fetchComments(article_id);
    }, [article_id]);

    const handleComment = () => {
      onComment(article_id, commentBody);
      setCommentBody('');
    };

    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        <h2 className="text-3xl font-bold mb-6">Comments</h2>
        {/* <div className="flex items-center mb-8">
          <input
            type="text"
            className="border rounded-l-lg p-3 flex-grow bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            required
          />
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg transition duration-200 ease-in-out" 
            onClick={handleComment}
          >
          </button>
        </div> */}
        <div className="flex items-center mb-8 space-x-2">
  <input
    type="text"
    className="border rounded-l-lg p-3 flex-grow bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    placeholder="Add a comment..."
    value={commentBody}
    onChange={(event) => setCommentBody(event.target.value)}
    required
  />
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg transition duration-200 ease-in-out"
    onClick={handleComment}
  >
    Comment
  </button>
</div>

        <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-200 mb-2">{comment.Users.username}</p>
          <p className="text-gray-200 mb-2">{comment.comment}</p>
          {userId === comment.user_id ? (
          <button
            onClick={() => handleDelete(comment.comment_id.toString())}
            className="text-red-500 hover:text-red-600 text-sm transition duration-200 ease-in-out"
          >
            Delete
          </button>
      ) : null}
    </div>
  ))}
</div>
      </div>
    );
  };

  export default Comments;