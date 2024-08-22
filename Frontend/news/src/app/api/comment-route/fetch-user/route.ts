import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { apiLinks } from '@/utils/constants';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (session?.accessToken) {
            headers['Authorization'] = `Bearer ${session.accessToken}`;
        }

        const response = await fetch(`${apiLinks.comments.fetch}/fetch-users`, {
            method: 'GET',
            headers: headers,
        });

        

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API responded with status ${response.status}: ${errorText}`);
            return NextResponse.json({ error: `Failed to fetch users: ${errorText}` }, { status: response.status });
        }

        const responseData = await response.json();
        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({ error: 'Error fetching users!' }, { status: 500 });
    }
}
