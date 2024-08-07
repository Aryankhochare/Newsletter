// src/app/api/deleteRole/route.js
import { NextResponse } from 'next/server';

let roles = ['Admin', 'Editor', 'User']; // Initial roles (this should be persistent storage)

export async function POST(request) {
  try {
    const { roleName } = await request.json();
    roles = roles.filter((role) => role !== roleName); // Remove the role from the array

    return NextResponse.json({ message: 'Role deleted successfully', roles }, { status: 200 });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ message: 'Error deleting role' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ roles }, { status: 200 });
}
