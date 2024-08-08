import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json();
        const { data, error } = await supabase
        .from('CommentTest')
        .delete()
        .eq('id', id);
        if (error) throw error;
        return NextResponse.json(data);
    } catch(error) {
        console.error(error);
        return NextResponse.json({error : "Error posting comments !"}, {status : 500})
    }
}