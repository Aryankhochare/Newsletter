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
        const response = await fetch(`../../api/commentRoute/fetchUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        // getUserId(data);
        //console.log(data, data.type);
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
        const response = await fetch(`../../api/commentRoute/fetchComment?id=${id}`, {
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
      try {
        const response = await fetch("../../api/commentRoute/insertComment", {
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
        const response = await fetch('../../api/commentRoute/deleteComment', {
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