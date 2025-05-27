import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If the user is authenticated and visiting "/", redirect to "/dashboard"
  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && request.nextUrl.pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If authenticated and trying to access signin, redirect to dashboard
  if (token && request.nextUrl.pathname === "/signin") {
    return NextResponse.redirect(new URL("/new-chat", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/new-chat", "/chat/:path*", "/trash"],
};
