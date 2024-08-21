  import { Suspense } from 'react';
  import Navbar from "@/components/navbarcomp/navbar";
  import Footer from "@/components/navbarcomp/footer";
  import UserManagement from '@/components/UserManagement';


  async function fetchUsers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/admin/users`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }

  async function fetchRoles() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/admin/users`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  }

  export default async function UsersAndRolesPage() {
    const userData = await fetchUsers();
    const rolesData = await fetchRoles();

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Management</h1>
          <Suspense fallback={<div>Loading users...</div>}>
            <UserManagement initialUserData={userData} />
          </Suspense>
          
        </div>
        <Footer />
      </div>
    );
  }