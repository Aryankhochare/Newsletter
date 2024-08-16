'use client'

import { signOut } from "next-auth/react";


export default function Page(){
    return(
        <div className="flex justify-center items-center h-screen ">
            <h1>Admin Page</h1>
            <button onClick={()=>signOut()}>signOut</button>
        </div>
    );
}