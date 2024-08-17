// import React, { useEffect, useState } from 'react';
// import Image from "next/image";
// import Link from 'next/link';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// export default function ProfileInfo() {
//     const [userRole, setUserRole] = useState('');

//     useEffect(() => {
//         // Retrieve the user role from localStorage
//         const role = localStorage.getItem('userRole');
//         setUserRole(role || '');
//     }, []);

//     const renderMenuItems = () => {
//         switch (userRole) {
//             case 'admin':
//                 return (
//                     <>
//                         <DropdownMenuItem>Profile</DropdownMenuItem>
//                         <Link href="/admin/dashboard"><DropdownMenuItem>Dashboard</DropdownMenuItem></Link>
//                         <Link href="/admin/roles"><DropdownMenuItem>Manage Roles</DropdownMenuItem></Link>
//                         <DropdownMenuItem>Requests</DropdownMenuItem>
//                         <DropdownMenuItem>System Settings</DropdownMenuItem>
//                     </>
//                 );
//             case 'editor':
//                 return (
//                     <>
//                         <DropdownMenuItem>Profile</DropdownMenuItem>
//                         <DropdownMenuItem>My Articles</DropdownMenuItem>
//                         <DropdownMenuItem>Create New Article</DropdownMenuItem>
//                         <DropdownMenuItem>Editorial Calendar</DropdownMenuItem>
//                     </>
//                 );
//             case 'writer':
//                 return (
//                     <>
//                         <DropdownMenuItem>Profile</DropdownMenuItem>
//                         <DropdownMenuItem>My Bookmarks</DropdownMenuItem>
//                         <DropdownMenuItem>Reading History</DropdownMenuItem>
//                         <DropdownMenuItem>Subscription Settings</DropdownMenuItem>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <div className="bg-white h-10 w-10 rounded-full">
//                     <img src="https://i.postimg.cc/2jxbrbYd/download.png" alt="profile" width={40} height={40}></img>
//                 </div>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="mr-8">
//                 <DropdownMenuLabel>My Account ({userRole})</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 {renderMenuItems()}
//                 <DropdownMenuItem>Log out</DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  User, 
  LayoutDashboard, 
  UserCog, 
  Inbox, 
  Settings, 
  FileText, 
  PenTool, 
  Calendar, 
  Bookmark, 
  History, 
  CreditCard, 
  LogOut, 
  SignpostBig
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function ProfileInfo() {
  const { data: session } = useSession();
  const userRoles =  (session?.user as any)?.roles || [];

  const renderMenuItems = () => {
    if (userRoles.includes('ADMIN')) {
      return (
        <>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <Link href="/main/admin/dashboard">
            <DropdownMenuItem>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/main/admin/roles">
            <DropdownMenuItem>
              <UserCog className="mr-2 h-4 w-4" />
              <span>Manage Roles</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            <Inbox className="mr-2 h-4 w-4" />
            <span>Requests</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </DropdownMenuItem>
        </>
      );
    } else if (userRoles.includes('EDITOR')) {
      return (
        <>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>My Articles</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Create New Article</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Editorial Calendar</span>
          </DropdownMenuItem>
        </>
      );
    } else if (userRoles.includes('WRITER')) {
      return (
        <>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bookmark className="mr-2 h-4 w-4" />
            <span>My Bookmarks</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            <span>Reading History</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription Settings</span>
          </DropdownMenuItem>
        </>
      );
    }
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-white h-10 w-10 rounded-full">
          <img src="https://i.postimg.cc/2jxbrbYd/download.png" alt="profile" width={40} height={40}/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8">
        <DropdownMenuLabel>My Account ({session?.user?.name})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderMenuItems()}
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" onClick={() => signOut()} />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}