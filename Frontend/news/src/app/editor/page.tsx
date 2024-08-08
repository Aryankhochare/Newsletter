// 'use client'

// import React, {useEffect, useState} from 'react';
// import parse from 'html-react-parser';
// import { supabase } from '@/app/api/auth/[...nextauth]/route';

// interface News {
//     id: string;
//     title: string;
//     editorcontent : string;
//     is_verified : boolean;
//   }

// export default function EditorPage(){
//     const fetchContent = async () => {
//         const {data, error} = await supabase
//             .from('NewsTest')
//             .select()
//             .eq('is_verified', false);
//         if (error)
//         {
//             console.log(error);
//         }
//         else
//         {
//             setUnverified(data);
//         }
//     }

//     useEffect(() => {
//         fetchContent();
//     }, [])


//     const [unverified, setUnverified] = useState<News[]>([])
//     return(
//         <div>
//             <h1>Unverified Content</h1>
//             <div>
//                 {unverified.map((unv) =>
//                 (
//                     <li key = {unv.id}>{unv.title} <br/> {parse(unv.editorcontent)}
//                     <button>Verify</button>
//                     <br/> <button>Reject</button>
//                     </li>
//                 ))}
//             </div>

//         </div>
//     );
// }

'use client'

import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

interface News {
  id: string;
  title: string;
  editorcontent: string;
}

export default function EditorPage() {
    const [unverified, setUnverified] = useState<News[]>([]);
    const fetchContent = async () => {
        try {
          const response = await fetch('api/editorRoute/fetchContent');
          const data = await response.json();
          setUnverified(data);
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };

  const handleVerify = async (id : string) => {
    try {
            await fetch('api/editorRoute/verifyContent',{
            method : 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({id}),
        });
        fetchContent();
      } catch (error) {
        console.error('Error fetching content:', error);
      }
      
    };

  const handleReject = async (id : string) => {
    try {
        await fetch('api/editorRoute/rejectContent',{
        method : 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body : JSON.stringify({id}),
    });
    fetchContent();
  } catch (error) {
    console.error('Error rejecting content:', error);
  }
  
};

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Unverified Content</h1>
      <ul className="space-y-4">
        {unverified.map((unv) => (
          <li key={unv.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{unv.title}</h2>
            <div className="text-gray-700 mb-4">{parse(unv.editorcontent)}</div>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors " onClick={() => handleVerify(unv.id)}>
                Verify
              </button>
              <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors" onClick={() => handleReject(unv.id)}>
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
