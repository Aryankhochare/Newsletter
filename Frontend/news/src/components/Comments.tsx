  'use client'

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken'
import { parseISO, formatDistanceToNow } from 'date-fns';

  interface username { //Added this !
    username : string;
  }
  interface Comment {
    comment_id: string;
    user_id: string;
    news_id: string;
    comment: string;
    posted_on: Date;
    Users : username; //Added this !
  }

  interface CommentsProps {
    article_id: string;
  }

  interface decodedToken {
    roles : string[]
  }

  const Comments: React.FC<CommentsProps> = ({ article_id }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBody, setCommentBody] = useState('');
    const [userId, setUserId] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const session = useSession();

    useEffect(() => {
      if (session.data?.accessToken) {
        const decodedToken = jwt.decode(session.data.accessToken) as decodedToken;
        setUserId(decodedToken.roles.toString());
        setIsAdmin(decodedToken.roles.includes('admin'));
      }
    }, [session.data]);

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
        setUserId(userIdFromData); 
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

    
    useEffect(() => {
      fetchComments(article_id);
    }, [article_id]);

    const handleComment = () => {
      onComment(article_id, commentBody);
      setCommentBody('');
    };

    return (
      <div className="p-6 bg-gray-900 min-h-screen text-whitez z-0">
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
          <p className="text-gray-200 mb-1">{formatDistanceToNow(parseISO(comment.posted_on.toLocaleString()))}</p>
          {isAdmin || userId === comment.user_id  ? (
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