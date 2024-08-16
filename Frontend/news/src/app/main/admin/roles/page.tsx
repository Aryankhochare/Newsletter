'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbarcomp/navbar";
import Footer from "@/components/navbarcomp/footer";
import { Badge } from "@/components/ui/badge";

interface UserRole {
  user_role_name: string;
}

interface UserUserRole {
  UserRoles: UserRole;
}

interface User {
  id: string;
  username: string;
  UserUserRoles?: UserUserRole[];
  userRoleNames?: string[];
}

const UsersAndRolesPage: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
  const [searchUsername, setSearchUsername] = useState('');
  const [searchRole, setSearchRole] = useState('all');
  const initialRoles = ['Admin', 'Editor', 'User'];
  const [roleName, setRoleName] = useState<string>('');
  const [dynamicRoles, setDynamicRoles] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://globalbuzz.azurewebsites.net/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('https://globalbuzz.azurewebsites.net/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDynamicRoles(data.roles || []);
      } else {
        console.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleRoleChange = (userId: string, value: string) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, userId: string) => {
    event.preventDefault();
    const selectedRole = selectedRoles[userId] || 'No role selected';
    try {
      const response = await fetch('https://globalbuzz.azurewebsites.net/admin/userroles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: selectedRole }),
      });

      if (response.ok) {
        alert(`Role assigned successfully for user with ID: ${userId}`);
        fetchUsers();
      } else {
        alert('Failed to assign role');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('An error occurred while assigning the role');
    }
  };

  const getUserRoles = (user: User): string[] => {
    return user.userRoleNames || [];
  };

  const availableRoles = (user: User): string[] => {
    const allRoles = ['admin', 'editor', 'writer'];
    const userRoles = getUserRoles(user).map(role => role.toLowerCase());
    return allRoles.filter(role => !userRoles.includes(role));
  };

  const filteredData = userData.filter(user => 
    user.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
    (searchRole === 'all' || getUserRoles(user).map(role => role.toLowerCase()).includes(searchRole.toLowerCase()))
  );

  const handleRoleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roleName.trim()) {
      try {
        const response = await fetch('https://globalbuzz.azurewebsites.net/admin/userroles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleName }),
        });

        if (response.ok) {
          setMessage(`Role "${roleName}" added successfully`);
          setRoleName('');
          fetchRoles();
        } else {
          const data = await response.json();
          setMessage(data.message || 'Failed to create role');
        }
      } catch (error) {
        console.error('Error creating role:', error);
        setMessage('An error occurred while creating the role');
      }
    } else {
      setMessage('Role name cannot be empty');
    }
  };

  const handleDelete = async (role: string) => {
    try {
      const response = await fetch('https://globalbuzz.azurewebsites.net/admin/userroles', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roleName: role }),
      });

      if (response.ok) {
        setMessage(`Role "${role}" deleted successfully`);
        fetchRoles();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setMessage('An error occurred while deleting the role');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex flex-col gap-1 w-full sm:w-64">
                <Label htmlFor="search-username">Search by Username</Label>
                <Input
                  id="search-username"
                  type="text"
                  placeholder="Enter username"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-64">
                <Label htmlFor="search-role">Search by Role</Label>
                <Select value={searchRole} onValueChange={setSearchRole}>
                  <SelectTrigger id="search-role">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((user: User) => (
              <div key={user.id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-0">
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-sm">User ID: {user.id}</div>
                  <div className='text-lg font-bold'>Username: {user.username}</div>
                </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {user.userRoleNames && user.userRoleNames.length > 0 ? (
                      user.userRoleNames.map((role: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        No Roles Assigned
                      </Badge>
                    )}
                  </div>
                </div>
                <form onSubmit={(event) => handleSubmit(event, user.id)} className="flex flex-col sm:flex-row items-center gap-2">
                  <Select
                    value={selectedRoles[user.id] || ''}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-40 bg-gray-200 border border-gray-300 rounded-md">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles(user).map(role => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-40 bg-green-200 text-green-800 hover:bg-green-300 py-2 px-4 text-sm"
                    variant="mine"
                  >
                    ASSIGN
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Role Management Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Roles</h1>

          <form onSubmit={handleRoleSubmit} className="mb-8">
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
      <div className='bottom-0 z-50 mt-2'>
        <Footer/>
      </div>
    </div>
  );
};

export default UsersAndRolesPage;