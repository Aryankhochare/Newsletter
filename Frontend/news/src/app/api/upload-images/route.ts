import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(request: NextRequest){
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if(!file){
            return NextResponse.json({error: 'No image file uploaded'},{status:400});
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const form = new FormData();
        form.append('image',buffer,{
            filename: file.name,
            contentType: file.type
        });
        const response = await axios.post(`${process.env.ASP_NET_URL}/newsletter/upload-image`,
            form,
            {
                headers: form.getHeaders(),
            });
        if(!response.data){
            throw new Error(`Backend request failed with status ${response.status}`);
        }
        return NextResponse.json(response.data,{status:200});
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Error uploading image' }, { status: 500 });
    }
}