// 'use client'

// import React, { useState, useEffect } from "react";
// import QuillEditor from '../../components/QuillEditor';
// import { supabase } from '@/app/api/auth/[...nextauth]/route';

// interface News {
//   id: string;
//   title: string;
//   editorcontent: string;
// } 

// export default function Home() {
//   const [rejected, setRejected] = useState<News[]>([]);
//   const fetchRejected = async () => {
//     const { data, error } = await supabase
//         .from('NewsTest')
//         .select('id, title, editorcontent')
//         .eq('is_verified', false)
//         .eq('is_rejected', true);

//     if (error) {
//       console.log(error);
//     } else {
//       setRejected(data);
//     }
//   };

//   const handleEdit = (id : string) => {
//     return
//   }

//   useEffect(() => {
//     fetchRejected();
//   }, []);

//   return (
//     <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-100">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">
//         Create Article :
//       </h1>
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg text-gray-900">
//       <QuillEditor />
//       </div>
//       <div className="p-8 bg-gray-100 min-h-screen text-center">
//         <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Rejected Articles : </h2>
//         {rejected.map((unv) => (
//           <div key={unv.id} className="bg-white p-4 rounded-lg shadow-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">{unv.title}</h2>
//             <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors" onClick={() => handleEdit(unv.id)}>
//                 Click to Edit
//               </button>
//             </div>))}
//       </div>
//     </main>
//   );
// }

'use client'

import React, { useState, useEffect } from "react";
import QuillEditor from '../../components/QuillEditor';


interface News {
  id: string;
  title: string;
  editorcontent: string;
} 

export default function Home() {
  

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Article :
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg text-gray-900">
      <QuillEditor />
      </div>
      
    </main>
  );
}

