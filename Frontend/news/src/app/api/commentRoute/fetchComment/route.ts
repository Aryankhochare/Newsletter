import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const {data, error} = await supabase.from("CommentTest").select()
        if (error) throw error;
        return NextResponse.json(data);
    } catch(error) {
        console.error(error);
        return NextResponse.json({error : "Error fetching comments !"}, {status : 500})
    }
}