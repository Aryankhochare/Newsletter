  import { Suspense } from 'react';
  import Navbar from "@/components/navbarcomp/navbar";
  import Footer from "@/components/navbarcomp/footer";
  import UserManagement from '@/components/UserManagement';
import { apiLinks } from '@/utils/constants';


  async function fetchUsers() {
    const res = await fetch(`${apiLinks.admin.fetchUser}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }

  async function fetchRoles() {
    const res = await fetch(`${apiLinks.admin.fetchUser}`, { cache: 'no-store' });
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
        <main className="min-h-screen mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-black p-4 shadow-lg rounded-lg h-20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">User Management</h1></div>
          <Suspense fallback={<div>Loading users...</div>}>
            <UserManagement initialUserData={userData} />
          </Suspense>
        </main>
        <Footer />
      </div>
    );
  }
