'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

interface Comment {
  id: number;
  body: string;
}

const Comments : React.FC = () => {
  
    const fetchComments = async () => {
      try {
        const response = await fetch('api/commentRoute/fetchComment');
        const data = await response.json();
        setComments(data);

      } catch (error) {
        console.log("Error fetching comments !", error)
      }
      // const { data, error } = await supabase
      //   .from('CommentTest')
      //   .select()
    
      // if (error) {
      //   alert("Error fetching comments!");
      //   console.error(error);
      // } else if (data) {
      //   setComments(data);
      // }
    }

    const onComment = async (newComment: Comment) => {
      try {
        await fetch('api/commentRoute/insertComment',{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
      },
        body : JSON.stringify(newComment),
    });
    fetchComments();

      } catch (error) {
        console.log("Error posting comments !", error)
      }
    };


    const handleDelete = async (id : number) => {
      try {
        await fetch('api/commentRoute/deleteComment',{
        method : 'DELETE',
        headers: {
            'Content-Type': 'application/json',
      },
        body : JSON.stringify({id}),
    });
    fetchComments();

      } catch (error) {
        console.log("Error posting comments !", error)
      }
    };
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBody, setCommentBody] = useState('');

    useEffect(() => {
      fetchComments();
    }, []);

    const handleComment = () => {
      if (commentBody.trim() !== '') {
        onComment({ id: Date.now(), body: commentBody.trim()});
        setCommentBody('');
      }
    };

    return (
      <div className="p-4 bg-black min-h-screen">
      <h2 className="text-2xl mb-4 text-white ">Comments</h2>
      <div className=" flex items-center mt-4">
      <input
        type="text"
        className="border rounded p-2 flex-grow bg-gray-700 text-white"
        placeholder="Add a comment..."
        value={commentBody}
        onChange={(event) => setCommentBody(event.target.value)}
        required
      />
      <button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={handleComment}>
        Comment
      </button>
    </div>
    <div className="mb-4 border-b pb-2 border-gray-600">
      {comments.map((comment) => (
        <li className = 'text-white' key={comment.id}>{comment.body}
        <button onClick={() => handleDelete(comment.id)}>Delete</button>
        </li>
      ))}
    </div>
    </div>
  );
};

export default Comments;

//////////////////////////////////////////////////BACKUP/////////////////////////////////////////////
// 'use client'

// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/app/api/auth/[...nextauth]/route';

// interface Comment {
//   id: string;
//   body: string;
//   comments: Comment[];
// }

// interface CommentItemProp {
//   comment: Comment;
// }

// interface CommentInputProp {
//   onComment: (newComment: Comment) => void;
// }

// const CommentInput = ({ onComment }: CommentInputProp) => {
//   const [commentBody, setCommentBody] = useState('');

//   const handleComment = () => {
//     if (commentBody.trim() !== '') {
//       onComment({ id: Date.now().toString(), body: commentBody.trim(), comments: [] });
//       setCommentBody('');
//     }
//   };

//   return (
//     <div className=" flex items-center mt-4">
//       <input
//         type="text"
//         className="border rounded p-2 flex-grow bg-gray-700 text-white"
//         placeholder="Add a comment..."
//         value={commentBody}
//         onChange={(event) => setCommentBody(event.target.value)}
//         required
//       />
//       <button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={handleComment}>
//         Comment
//       </button>
//     </div>
//   );
// };

// const CommentItem = ({ comment }: CommentItemProp) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [comments, setComments] = useState(comment.comments || []);

//   const onComment = (newComment: Comment) => {
//     setComments((prev) => [newComment, ...prev]);
//   };

//   return (
//     <div className="mb-4 border-b pb-2 border-gray-600">
//       <p className='text-white'>{comment.body}</p>
//       <button
//         className="text-blue-500 text-sm mt-2"
//         onClick={() => setIsReplying(!isReplying)}
//       >
//         {isReplying ? 'Cancel' : 'Reply'}
//       </button>
//       {isReplying && <CommentInput onComment={onComment} />}
//       {comments.map((comment) => (
//         <CommentItem key={comment.id} comment={comment} />
//       ))}
//     </div>
//   );
// };

// const Comments : React.FC = () => {
//     // const [comment, setComment] = useState<Comment[]>([]);
//     const [commentBody, setCommentBody] = useState('');
  
//     const fetchComments = async () => {
//       const { data, error } = await supabase
//         .from('CommentTest')
//         .select('id, body, comments');
    
//       if (error) {
//         alert("Error fetching comments!");
//         console.error(error);
//       } else if (data) {
//         setComments(data);
//       }
//     }
    
  
//     useEffect(() => {
//       fetchComments();
//     }, []);


// // const dummyComments: Comment[] = [
// //   { id: '1', body: 'What a crappy article!', comments: [] },
// //   { id: '2', body: 'Enjoyed the content. Keep up the good work.', comments: [] },
// //   { id: '3', body: 'Sauce?', comments: [] },
// //   { id: '4', body: 'Joe Biden did nothing wrong!', comments: [] },
// // ];

//     const [comments, setComments] = useState<Comment[]>([]);

//     const onComment = (newComment: Comment) => {
//       setComments((prev) => [newComment, ...prev]);
//     };

//     return (
//       <div className="p-4 bg-black min-h-screen">
//       <h2 className="text-2xl mb-4 text-white ">Comments</h2>
//       <CommentInput onComment={onComment} />
//       {comments.map((comment) => (
//         <CommentItem key={comment.id} comment={comment} />
//       ))}
//     </div>
//   );
// };
 

// export default Comments;
