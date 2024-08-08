import { NextResponse } from 'next/server';
import { supabase } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('NewsTest')
      .select('id, title, editorcontent')
      .eq('is_verified', false)
      .eq('is_rejected', false);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error : "Error fetching content !" }, { status: 500 });
  }
}