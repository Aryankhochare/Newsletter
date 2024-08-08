import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
    try {
        const newComment: Comment = await req.json();
        const { data, error } = await supabase
        .from('CommentTest')
        .insert([newComment])
        if (error) throw error;
        return NextResponse.json(data);
    } catch(error) {
        console.error(error);
        return NextResponse.json({error : "Error posting comments !"}, {status : 500})
    }
}