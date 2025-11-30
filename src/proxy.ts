// src/proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // PUBLIC ROUTES (NO AUTH REQUIRED)
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth",
   
  ];

  if (publicRoutes.some((path) =>pathname.startsWith(path))){
       return NextResponse.next();
  }


  // CHECK TOKEN
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET!,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // AUTHORIZED
  return NextResponse.next();

  
}
export const config = {
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|api/auth|favicon|assets).*)",
}; 
