import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth";
import { apiLinks } from '@/utils/constants';
import { authOptions } from '../../auth/[...nextauth]/options';

interface InsertComment {
    news_id : string;
    content : string;
}

declare module "next-auth" {
    interface Session {
      accessToken: string;
    }
  }

export async function POST(req: NextRequest) {
    try {
        console.log("Entered the API route !");
        //Checking if user is authorized :
        const session = await getServerSession(authOptions);

        if (!session || !session.accessToken) { //If not, throw error !
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { NewsId, Comment }: { NewsId: string; Comment: string } = await req.json();
        const response = await fetch(apiLinks.comments.fetch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify({NewsId, Comment}),
        });


        //Error Handling and Debugging !
        const responseText = await response.text();
        console.log(`ASP.NET API raw response: ${responseText}`);

        if (!response.ok) {
            console.error(`ASP.NET API responded with status ${response.status}: ${responseText}`);
            return NextResponse.json({ error: `Failed to post comment to ASP.NET API: ${responseText}` }, { status: response.status });
        }

        console.log("ASP has been accessed and comment is sent!");
        
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
        return NextResponse.json({ error: 'Error posting comment!'}, { status: 500 });
    }
}