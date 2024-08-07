// // src/app/api/createRole/route.js
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { roleName } = await request.json();

//     // Connect to your database and save the new role
//     // Example: Using a database client to insert the role
//     // await db.collection('roles').insertOne({ name: roleName });

//     // Respond with a success message
//     return NextResponse.json({ message: 'Role created successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error creating role:', error);
//     return NextResponse.json({ message: 'Error creating role' }, { status: 500 });
//   }
// }
// src/app/api/createRole/route.js
import { NextResponse } from 'next/server';

let roles = []; // In-memory storage for roles

export async function POST(request) {
  try {
    const { roleName } = await request.json();
    roles.push(roleName); // Add the new role to the in-memory array

    return NextResponse.json({ message: 'Role created successfully', roles }, { status: 200 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ message: 'Error creating role' }, { status: 500 });
  }
}

export async function GET() {
  // Endpoint to get the current roles
  return NextResponse.json({ roles }, { status: 200 });
}
