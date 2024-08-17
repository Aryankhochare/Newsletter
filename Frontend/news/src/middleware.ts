import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

interface CustomToken extends JWT {
  roles?: string[];
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as CustomToken;
    const pathname = req.nextUrl.pathname;

    console.log("Pathname:", pathname);
    console.log("Token Roles:", token?.roles);

    if (pathname === "/") {
      console.log("Redirecting to /user page upon login");
      return NextResponse.redirect(new URL("/main", req.url));
    }

    if (token?.roles?.includes("ADMIN")) {
      console.log("ADMIN accessing all routes");
      return NextResponse.next();
    }

    if (token?.roles?.includes("EDITOR")) {
      if (pathname.startsWith("/main/admin") || pathname.startsWith("/main/writer")) {
        return NextResponse.error();
      }
      if (!pathname.startsWith("/main/editor") && !pathname.startsWith("/main/user")) {
        console.log("Redirecting EDITOR to editor page");
        return NextResponse.redirect(new URL("/main/editor", req.url));
      }
      console.log("EDITOR accessing editor or user routes");
      return NextResponse.next();
    }

    if (token?.roles?.includes("WRITER")) {
      if (pathname.startsWith("/main/admin") || pathname.startsWith("/main/editor")) {
        return NextResponse.error();
      }
      if (!pathname.startsWith("/main/writer") && !pathname.startsWith("/main/user")) {
        console.log("Redirecting WRITER to writer page");
        return NextResponse.redirect(new URL("/main/writer", req.url));
      }
      console.log("WRITER accessing writer or user routes");
      return NextResponse.next();
    }

    if (token?.roles?.includes("USER")) {
      if (pathname.startsWith("/admin") || pathname.startsWith("/editor") || pathname.startsWith("/writer")) {
        return NextResponse.error();
      }
      if (!pathname.startsWith("/main/user")) {
        console.log("Redirecting USER to user page");
        return NextResponse.redirect(new URL("/main/user", req.url));
      }
      console.log("USER accessing user routes");
      return NextResponse.next();
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

export const config = { matcher: ['/','/main', '/main/admin/:path*', '/main/editor/:path*', '/main/writer/:path*', '/main/user/:path*'] };
