
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Navbar from '@/components/navbar';

// const RolesPage: React.FC = () => {
//   const initialRoles = ['Admin', 'Editor', 'User']; // Hardcoded initial roles
//   const [roleName, setRoleName] = useState<string>('');
//   const [dynamicRoles, setDynamicRoles] = useState<string[]>([]); // State for dynamically added roles
//   const [message, setMessage] = useState<string>(''); // State to hold feedback message

//   useEffect(() => {
//     // Fetch the roles from the server on component mount (if needed)
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch('/api/createRole');
//         if (response.ok) {
//           const data = await response.json();
//           setDynamicRoles(data.roles);
//         } else {
//           setMessage('Failed to fetch roles');
//         }
//       } catch (error) {
//         console.error('Error fetching roles:', error);
//       }
//     };

//     fetchRoles();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       if (roleName.trim()) {
//         const response = await fetch('/api/createRole', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ roleName }),
//         });

//         if (response.ok) {
//           // Update dynamically added roles state
//           setDynamicRoles((prevRoles) => [...prevRoles, roleName]);
//           setMessage(`Role "${roleName}" added successfully`);
//           setRoleName('');
//         } else {
//           const data = await response.json();
//           setMessage(data.message || 'Failed to create role');
//         }
//       } else {
//         setMessage('Role name cannot be empty');
//       }
//     } catch (error) {
//       setMessage('An error occurred while creating the role.');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (role: string) => {
//     try {
//       const response = await fetch('/api/deleteRole', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ roleName: role }),
//       });

//       if (response.ok) {
//         setDynamicRoles((prevRoles) => prevRoles.filter((r) => r !== role));
//         setMessage(`Role "${role}" deleted successfully`);
//       } else {
//         const data = await response.json();
//         setMessage(data.message || 'Failed to delete role');
//         console.error('Failed to delete role:', data);
//       }
//     } catch (error) {
//       setMessage('An error occurred while deleting the role.');
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <Navbar/>
//       <h1>Create Roles</h1>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="role">Role Name:</label>
//         <input
//           type="text"
//           id="role"
//           name="role"
//           value={roleName}
//           onChange={(e) => setRoleName(e.target.value)}
//           required
//         />
//         <button type="submit">Add Role</button>
//       </form>

//       {message && <p>{message}</p>}

//       <h2>Roles List</h2>
//       <ul>
//         {initialRoles.map((role, index) => (
//           <li key={index}>
//             {role}
//             <button
//               onClick={() => alert("You cannot delete hardcoded roles.")}
//               style={{ marginLeft: '10px', cursor: 'not-allowed' }}
//               disabled
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//         {dynamicRoles.map((role, index) => (
//           <li key={index + initialRoles.length}>
//             {role}
//             <button
//               onClick={() => handleDelete(role)}
//               style={{ marginLeft: '10px', cursor: 'pointer' }}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default RolesPage;

'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';

const fetchRoles = async () => {
  try {
    const response = await fetch('/api/createRole');
    if (response.ok) {
      const data = await response.json();
      return data.roles;
    } else {
      console.error('Failed to fetch roles');
      return [];
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

const RolesPage: React.FC = () => {
  const initialRoles = ['Admin', 'Editor', 'User'];
  const [roleName, setRoleName] = useState<string>('');
  const [dynamicRoles, setDynamicRoles] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  React.useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await fetchRoles();
      setDynamicRoles(fetchedRoles);
    };
    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (roleName.trim()) {
        const response = await fetch('/api/createRole', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleName }),
        });

        if (response.ok) {
          setDynamicRoles((prevRoles) => [...prevRoles, roleName]);
          setMessage(`Role "${roleName}" added successfully`);
          setRoleName('');
        } else {
          const data = await response.json();
          setMessage(data.message || 'Failed to create role');
        }
      } else {
        setMessage('Role name cannot be empty');
      }
    } catch (error) {
      setMessage('An error occurred while creating the role.');
      console.error(error);
    }
  };

  const handleDelete = async (role: string) => {
    try {
      const response = await fetch('/api/deleteRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleName: role }),
      });

      if (response.ok) {
        setDynamicRoles((prevRoles) => prevRoles.filter((r) => r !== role));
        setMessage(`Role "${role}" deleted successfully`);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete role');
        console.error('Failed to delete role:', data);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the role.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Roles</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center space-x-4">
            <label htmlFor="role" className="inline w-28 text-sm font-medium text-gray-700">
              Role Name:
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md h-10"
            />
            <button
              type="submit"
              className="w-32 inline-flex items-center pl-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Role
            </button>
          </div>
        </form>

        {message && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
            <p>{message}</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Roles List</h2>
        <ul className="bg-white shadow overflow-hidden sm:rounded-md">
          {initialRoles.concat(dynamicRoles).map((role, index) => (
            <li key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="text-sm font-medium text-indigo-600 truncate">{role}</div>
                <button
                  onClick={() => index < initialRoles.length ? alert("You cannot delete hardcoded roles.") : handleDelete(role)}
                  className={`ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                    index < initialRoles.length
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  }`}
                  disabled={index < initialRoles.length}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RolesPage;