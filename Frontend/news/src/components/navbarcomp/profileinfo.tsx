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
import { redirect } from 'next/navigation';
 
export default function ProfileInfo() {
  const { data: session } = useSession();
  const userRoles =  (session?.user as any)?.roles || [];
 
  const renderMenuItems = () => {
    if (userRoles.includes('ADMIN')) {
      return (
        <>
        <Link href="/main/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
     
        </>
      );
    } else if (userRoles.includes('EDITOR')) {
      return (
        <>
        <Link href="/main/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
         
        </>
      );
    } else if (userRoles.includes('WRITER')) {
      return (
        <>
        <Link href="/main/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </Link>
         
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}