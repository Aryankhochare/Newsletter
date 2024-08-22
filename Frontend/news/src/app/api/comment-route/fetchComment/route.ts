// import { NextResponse, NextRequest } from 'next/server';
// import { supabase } from '@/app/api/auth/[...nextauth]/route';

// export async function GET(req: NextRequest) {
//     try {
//         // const {id} = await req.json();
//         const id = req.nextUrl.searchParams.get('id');
//         if (!id) {
//             return NextResponse.json({ error: "ID is required" }, { status: 400 });
//         }
//         const {data, error} = await supabase.from("Comments").select().eq('news_id', id);
//         if (error) throw error;
//         return NextResponse.json(data);
//     } catch(error) {
//         console.error(error);
//         return NextResponse.json({error : "Error fetching comments !"}, {status : 500})
//     }
// }

import { supabase } from '@/lib/supabaseClient';
import { NextResponse, NextRequest } from 'next/server';


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

