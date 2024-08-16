import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

interface Comment {
  id: number;
  body: string;
  // author: string;
  // createdAt: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('CommentTest')
      .select()

    if (error) {
      alert("Error fetching comments!");
      console.error(error);
    } else if (data) {
      setComments(data);
    }
  };

  const onComment = async (newComment: Omit<Comment, 'id'>) => {
    const { data, error } = await supabase
      .from('CommentTest')
      .insert([newComment])
      .select();

    if (error) {
      alert("Error posting comment!");
      console.error(error);
    } else {
      fetchComments();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('CommentTest')
      .delete()
      .match({ id });

    if (error) {
      alert("Error deleting comment!");
      console.error(error);
    } else {
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleComment = () => {
    if (commentBody.trim() !== '') {
      onComment({
        body: commentBody.trim(),
        // author: 'Anonymous',
        // createdAt: new Date().toISOString(),
      });
      setCommentBody('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-700 text-white">
      <div className="flex-grow overflow-y-auto scrollbar-hide px-4 py-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start">
              {/* <div>
                <h4 className="font-semibold text-blue-400">{comment.author}</h4>
                <p className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
              </div> */}
              <button
                onClick={() => handleDelete(comment.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
            <p className="mt-2 text-gray-300">{comment.body}</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-900">
        <textarea
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Add a comment..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />
        <button
          className="mt-2 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={handleComment}
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default Comments;