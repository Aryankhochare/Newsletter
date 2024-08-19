// // app/users-and-roles/components/ExistingRoles.tsx
// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';

// interface Props {
//   initialRoles: string[];
// }

// export default function ExistingRoles({ initialRoles }: Props) {
//   const [dynamicRoles, setDynamicRoles] = useState<string[]>(initialRoles);
//   const [message, setMessage] = useState<string>('');

//   const handleDelete = async (role: string) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/admin/userroles`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ roleName: role }),
//       });

//       if (response.ok) {
//         setMessage(`Role "${role}" deleted successfully`);
//         setDynamicRoles(dynamicRoles.filter(r => r !== role));
//       } else {
//         const data = await response.json();
//         setMessage(data.message || 'Failed to delete role');
//       }
//     } catch (error) {
//       console.error('Error deleting role:', error);
//       setMessage('An error occurred while deleting the role');
//     }
//   };

//   return (
//     <div className="mt-12">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-4">Existing Roles</h2>
//       <ul className="space-y-2">
//         {dynamicRoles.map((role, index) => (
//           <li key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow">
//             <span>{role}</span>
//             <Button
//               variant="outline"
//               className="w-40 bg-red-500 text-white px-3 py-2 rounded-md"
//               onClick={() => handleDelete(role)}
//             >
//               Delete
//             </Button>
//           </li>
//         ))}
//       </ul>
//       {message && <p className="mt-4 text-red-500">{message}</p>}
//     </div>
//   );
// }