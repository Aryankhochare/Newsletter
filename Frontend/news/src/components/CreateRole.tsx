// // app/users-and-roles/components/CreateRole.tsx
// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from "@/components/ui/input";

// export default function CreateRole() {
//   const [roleName, setRoleName] = useState<string>('');
//   const [message, setMessage] = useState<string>('');

//   const handleRoleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (roleName.trim()) {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/admin/user`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ roleName }),
//         });

//         if (response.ok) {
//           setMessage(`Role "${roleName}" added successfully`);
//           setRoleName('');
//         } else {
//           const data = await response.json();
//           setMessage(data.message || 'Failed to create role');
//         }
//       } catch (error) {
//         console.error('Error creating role:', error);
//         setMessage('An error occurred while creating the role');
//       }
//     } else {
//       setMessage('Role name cannot be empty');
//     }
//   };

//   return (
//     <div className="mt-12">
//       <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create New Role</h2>
//       <form onSubmit={handleRoleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//         <Input
//           type="text"
//           placeholder="Role name"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           className="w-full sm:w-auto"
//         />
//         <Button className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">
//           Add Role
//         </Button>
//       </form>
//       {message && <p className="mt-4 text-red-500">{message}</p>}
//     </div>
//   );
// }