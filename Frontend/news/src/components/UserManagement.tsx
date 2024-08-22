'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiLinks } from '@/utils/constants';

interface User {
  id: string;
  username: string;
  userRoleNames?: string[];
}

interface Props {
  initialUserData: User[];
}

export default function UserManagement({ initialUserData }: Props) {
  const [userData, setUserData] = useState<User[]>(initialUserData);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
  const [searchUsername, setSearchUsername] = useState('');
  const [searchRole, setSearchRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRoleChange = (userId: string, value: string) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, userId: string) => {
    event.preventDefault();
    const selectedRole = selectedRoles[userId];
    
    if (!selectedRole) {
      alert('Please select a role before submitting.');
      return;
    }
  
    try {
      const updateData = {
        username:"",
        password:"",
        email:"",
        userRoles: [getRoleId(selectedRole)]
      };
  
      const response = await fetch(`${apiLinks.admin.fetchUser}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        const responseData = await response.text();
        alert(responseData || `Role "${selectedRole}" assigned successfully for user with ID: ${userId}`);
        window.location.reload(); // Refresh the page
        // Refresh user data
        const updatedUserData = await fetch(`${apiLinks.admin.fetchUser}`).then(res => res.json());
        setUserData(updatedUserData);
      } else {
        const errorData = await response.text();
        alert(`Failed to assign role: ${errorData}`);
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('An error occurred while assigning the role');
    }
  };

  const getRoleId = (roleName: string): number => {
    const roleMapping: { [key: string]: number } = {
      admin: 1,
      editor: 2,
      writer: 3,
      user: 4,
    };
    return roleMapping[roleName.toLowerCase()] || 4;
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

  return (
    <div className="mb-12">
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
          <div className="flex flex-col gap-1 w-full sm:w-64 ">
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
        {loading ? (
          // Skeleton loading
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-0">
                <div className="text-center sm:text-left">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ))
        ) : (
          filteredData.map((user: User) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-0">
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-sm">User ID: {user.id}</div>
                  <div className='text-md'>Username: {user.username}</div>
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
                  className="w-40 bg-green-500 text-white px-3 py-2 rounded-md"
                  type="submit"
                  disabled={!selectedRoles[user.id]}
                >
                  Assign Role
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}