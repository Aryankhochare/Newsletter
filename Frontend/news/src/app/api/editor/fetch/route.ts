import { useArticleStore } from "@/app/ArticleStore";
import axios from "axios";
import { NextResponse } from "next/server";
import { supabase } from "../../auth/[...nextauth]/route";

export async function GET(){
    try {
        const response =await axios.get(`${process.env.ASP_NET_URL}/newsletter`)
        console.log(response.data);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error : "Error fetching content !" }, { status: 500 });
    }
}

export async function PATCH(){
    
}