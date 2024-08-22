
import { supabase } from '@/lib/supabaseClient';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("Comments")
            .select(`
                *,
                Users:user_id (username)
            `)
            .eq('news_id', id);

        if (error) throw error;

        return NextResponse.json(data);
    } catch(error) {
        console.error(error);
        return NextResponse.json({error : "Error fetching comments!"}, {status : 500})
    }
}

