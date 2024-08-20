import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiLinks } from '@/utils/constants';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (session?.accessToken) {
            headers['Authorization'] = `Bearer ${session.accessToken}`;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_ASP_NET_URL}/comments/FetchUsers`, {
            method: 'GET',
            headers: headers,
        });

        console.log(response);
        

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ASP.NET API responded with status ${response.status}: ${errorText}`);
            return NextResponse.json({ error: `Failed to fetch users: ${errorText}` }, { status: response.status });
        }

        const responseData = await response.json();
        console.log(responseData);
        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({ error: 'Error fetching users!' }, { status: 500 });
    }
}
