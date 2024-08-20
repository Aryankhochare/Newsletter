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
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileInfo() {
  const { data: session, status } = useSession();
  const userRoles = (session?.user as any)?.roles || [];

  const renderMenuItems = () => {
    if (status === 'loading') {
      return (
        <>
          <DropdownMenuItem>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          </DropdownMenuItem>
        </>
      );
    }

    if (userRoles.includes('ADMIN')) {
      return (
        <>
        <Link href="/main/admin/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
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
        <DropdownMenuLabel>
          {status === 'loading' ? (
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
          ) : (
            `My Account (${session?.user?.name})`
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderMenuItems()}
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}