// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // auth() function dari NextAuth

export async function middleware(req: NextRequest) {
  const session = await auth();

  // URL pathname yang diakses
  const { pathname } = req.nextUrl;

  // List halaman yang tidak butuh login
  const publicPaths = ["/signin", "/signup", "/api/auth", "/_next", "/favicon.ico"];

  // Kalau termasuk halaman public → lanjut aja
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Kalau belum login → redirect ke /signin
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // match semua route kecuali asset
};
