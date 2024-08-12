

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

interface CustomToken extends JWT {
    roles?: string[];
  }

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
    const token = req.nextauth.token as CustomToken
    console.log("Pathname:", req.nextUrl.pathname);
    console.log("Has ADMIN role:", token?.roles?.includes("ADMIN"));
    if (!req.nextUrl.pathname.includes("/admin") && token?.roles?.includes("ADMIN")){
        console.log("Redirecting to admin page");
      return NextResponse.redirect(new URL("/admin",req.url));
    }

    else if (!req.nextUrl.pathname.includes("/editor") && token?.roles?.includes("EDITOR")) {
        console.log("Redirecting to editor page");
      return NextResponse.redirect(new URL("/editor",req.url));
    }

    else if (!req.nextUrl.pathname.includes("/writer") && token?.roles?.includes("WRITER")) {
      console.log("Redirecting to writer page");
    return NextResponse.redirect(new URL("/writer",req.url));
  }

    else if (!req.nextUrl.pathname.includes("/user") && token?.roles?.includes("USER")) {
        console.log("Redirecting to user page");
      return NextResponse.redirect(new URL("/user",req.url));
    }

    console.log("Proceeding with request");
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: (params) => {
        const { token } = params;
        return !!token;
      },
    },
  }
);

export const config = {matcher:['/']};