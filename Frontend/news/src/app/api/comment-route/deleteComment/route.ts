import { NextResponse, NextRequest } from 'next/server';
//import { supabase } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json();
        const response = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/comments/${id}`, {
            method : 'DELETE',
            headers : {'Content-Type': 'application/json',
            },
            body:JSON.stringify({id}),
        });
            
        const responseText = await response.text();
        console.log(`ASP.NET in raw response : ${responseText}`)
        if (!response.ok) {
            console.error(`ASP.NET API responded with status ${response.status}: ${responseText}`);
            return NextResponse.json({ error: `Failed to delete comment to ASP.NET API: ${responseText}` }, { status: response.status });
        }
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
                return NextResponse.json({ error: 'Invalid JSON response from server' }, { status: 500 });
            }
            
            return NextResponse.json(responseData);
        } catch (error) {
            console.error('Detailed error:', error);
            return NextResponse.json({ error: 'Error deleting comment!'}, { status: 500 });
        }
    }