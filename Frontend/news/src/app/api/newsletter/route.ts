import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const form = new FormData();

    console.log('Received form data:', Object.fromEntries(formData));

    const title = formData.get('Title');
    const content = formData.get('EditorContent');

    if (typeof title === 'string') {
      form.append('Title', title);
    }
    if (typeof content === 'string') {
      form.append('EditorContent', content); // Note the change here
    }

    const file = formData.get('CoverImage') as File | null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      form.append('CoverImage', buffer, {
        filename: file.name,
        contentType: file.type,
      });
    }

    const response = await fetch(`${process.env.ASP_NET_URL}/newsletter`, {
      method: 'POST',
      body: form as any,
      headers: form.getHeaders(),
    });

    console.log('Backend response status:', response.status);
    const responseText = await response.text();
    console.log('Backend response:', responseText);

    if (!response.ok) {
      throw new Error(`Backend request failed with status ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Error submitting to backend', details: error.message }, { status: 500 });
  }
}