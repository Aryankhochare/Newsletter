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
  SignpostBig,
  Trash2
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import { apiLinks } from '@/utils/constants';

interface decodedToken {
  sub : string;
  email: string;
}

export default function ProfileInfo() {
  const { data: session } = useSession();
  const userRoles =  (session?.user as any)?.roles || [];

  const router = useRouter()

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (session?.accessToken) {
          const decodedToken = jwt.decode(session.accessToken) as decodedToken;
          const thisId = decodedToken.sub;
          const email = decodedToken.email.toString();

          const isUUID = (str: string) => {
            const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\$/;
            return uuidRegex.test(str);
          };

          let endpoint;
          if (isUUID(thisId)) {
            endpoint = `${apiLinks.user.fetch}/${thisId}`;
          } else {
            const userId = decodedToken.sub as string;
            endpoint = `${apiLinks.user.fetch}/${email}`;
          }

          const response = await fetch(endpoint, {
            method: 'DELETE',
          });

          if (response.ok) {
            await signOut();
            router.push('/');
          } else {
            const errorText = await response.text();
            console.error('Error deleting account:', response.status, errorText);
            alert(`Failed to delete account. Status: ${response.status}. Please try again or contact support.`);
          }
        } else {
          alert('User email not found in session. Please try logging in again.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account.');
      }
    }
  };



  const renderMenuItems = () => {
    if (userRoles.includes('ADMIN')) {
      return (
        <>
        <Link href="/main/admin/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
          {/* <Link href="/main/admin/dashboard">
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
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </DropdownMenuItem> */}
        </>
      );
    } else if (userRoles.includes('EDITOR')) {
      return (
        <>
        <Link href="/main/editor/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
          {/* <Link href = '/main/editor'>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Articles</span>
          </DropdownMenuItem>
          </Link> */}
          {/* <DropdownMenuItem>
            <PenTool className="mr-2 h-4 w-4" />
            <span>View Articles</span>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Editorial Calendar</span>
          </DropdownMenuItem> */}
        </>
      );
    } else if (userRoles.includes('WRITER')) {
      return (
        <>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          {/* <Link href='/main/writer/quill_editor'>
          <DropdownMenuItem>
           <PenTool className="mr-2 h-4 w-4" />
            <span>Workspace</span>
          </DropdownMenuItem>
          </Link> */}
          {/* <DropdownMenuItem>
            <History className="mr-2 h-4 w-4" />
            <span>Reading History</span>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Subscription Settings</span>
          </DropdownMenuItem> */}
        </>
      );
    }
    return null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-white h-10 w-10 rounded-full">
          <Image src="https://i.postimg.cc/2jxbrbYd/download.png" alt="profile" width={40} height={40}/>
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
        <DropdownMenuSeparator />
  <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-600">
    <Trash2 className="mr-2 h-4 w-4" />
    <span>Delete Account</span>
  </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}