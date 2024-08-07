import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Link from 'next/link';

export default function ProfileInfo() {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <div className="bg-white h-10 w-10 rounded-full">
                    <img src="https://i.postimg.cc/2jxbrbYd/download.png" alt="profile" width={40} height={40}></img>
                </div>
           

            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-8">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                
                 <Link href="/roles" >
               
        
                <DropdownMenuItem>Manage Roles</DropdownMenuItem>
                </Link>
                
               
                <DropdownMenuItem>Requests</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>



            </DropdownMenuContent>
        </DropdownMenu>

    );
};

