// import React, { useState } from 'react'

// interface Comment {
//     id: string;
//     body: string;
//     comments: Array<Comment>;
// }

// interface CommentItemProp {
//     comment: Comment;
// }

// interface CommentInputProp {
//     onComment: (newComment: Comment) => void;
// }

// const CommentInput = ({ onComment }: CommentInputProp) => {
//     const [commentBody, setCommentBody] = useState('');

//     const handleComment = () => {
//         if (commentBody.trim() !== '') {
//             onComment({ id: '5', body: commentBody.trim(), comments: [] });
//             setCommentBody("");
//         }
//     };

//     return (
//         <div className='flex flex-col mt-4'>
//             <input
//                 type='text' 
//                 placeholder='Enter Comment : ' 
//                 className='border border-gray-300 rounded-md p-2 w-full md:w-3/4'
//                 value={commentBody}
//                 onChange={event => setCommentBody(event.target.value)}
//                 required
//             />
//             <button 
//                 className={`mt-2 text-white rounded-full py-2 w-24 pl-2 pr-2 transition-colors ${
//                     commentBody.trim() !== '' 
//                     ? 'bg-blue-500 hover:bg-blue-600' 
//                     : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//                 onClick={handleComment}
//                 disabled={commentBody.trim() === ''}
//             > 
//                 Comment 
//             </button>
//         </div>
//     )
// }

// const CommentItem = ({ comment }: CommentItemProp) => {
//     const [isReplying, setIsReplying] = useState(false);
//     const [comments, setComments] = useState(comment.comments)
//     const onComment = (newComment: Comment) => {
//         setComments(prev => [newComment, ...prev]);
//     };
//     return (
//         <div key={comment.id} className="border border-gray-300 rounded-md p-4 mb-4">
//             <p className="mb-2">{comment.body}</p>
//             <button 
//                 className='text-blue-500 hover:text-blue-600 transition-colors' 
//                 onClick={() => setIsReplying(!isReplying)}
//             >
//                 {isReplying ? 'Cancel' : 'Reply'}
//             </button>
//             {isReplying && <CommentInput onComment={onComment}/>}
//             <div className='mt-4 ml-4'>
//                 {comments.map((comment) => (
//                     <CommentItem key={comment.id} comment={comment} />
//                 ))}
//             </div>
//         </div>
//     );        
// }

// const Comments = () => {
//     const dummyComments: Array<Comment> = [
//         {
//             id: '1',
//             body: 'What a crappy article !',
//             comments: [],
//         },
//         {
//             id: '2',
//             body: 'Enjoyed the content. Keep up the good work.',
//             comments: [],
//         },
//         {
//             id: '3',
//             body: 'Sauce ?',
//             comments: [],
//         },
//         {
//             id: '4',
//             body: 'Jo Biden did nothing wrong !!!!!',
//             comments: [],
//         }
//     ];

//     const [comments, setComments] = useState(dummyComments);

//     const onComment = (newComment: Comment) => {
//         setComments(prev => [newComment, ...prev]);
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6">
//             <h2 className="text-3xl font-bold mb-6">Comment Section</h2>
//             <CommentInput onComment={onComment}/>
//             <div className='mt-8'>
//                 {comments.map((comment) => (
//                     <CommentItem key={comment.id} comment={comment} />
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Comments


import React, { useState } from 'react';

interface Comment {
  id: string;
  body: string;
  comments: Comment[];
}

interface CommentItemProp {
  comment: Comment;
}

interface CommentInputProp {
  onComment: (newComment: Comment) => void;
}

const CommentInput = ({ onComment }: CommentInputProp) => {
  const [commentBody, setCommentBody] = useState('');

  const handleComment = () => {
    if (commentBody.trim() !== '') {
      onComment({ id: Date.now().toString(), body: commentBody.trim(), comments: [] });
      setCommentBody('');
    }
  };

  return (
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
  );
};

const CommentItem = ({ comment }: CommentItemProp) => {
  const [isReplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState(comment.comments);

  const onComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="mb-4 border-b pb-2 border-gray-600">
      <p className='text-white'>{comment.body}</p>
      <button
        className="text-blue-500 text-sm mt-2"
        onClick={() => setIsReplying(!isReplying)}
      >
        {isReplying ? 'Cancel' : 'Reply'}
      </button>
      {isReplying && <CommentInput onComment={onComment} />}
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

const Comments = () => {
  const dummyComments: Comment[] = [
    { id: '1', body: 'What a crappy article!', comments: [] },
    { id: '2', body: 'Enjoyed the content. Keep up the good work.', comments: [] },
    { id: '3', body: 'Sauce?', comments: [] },
    { id: '4', body: 'Joe Biden did nothing wrong!', comments: [] },
  ];

  const [comments, setComments] = useState<Comment[]>(dummyComments);

  const onComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-2xl mb-4 text-white ">Comments</h2>
      <CommentInput onComment={onComment} />
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
