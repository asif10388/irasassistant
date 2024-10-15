import { cookies } from "next/headers";
import { verifyToken } from "@lib/auth/verifyToken";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/auth"];
const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  //   const path = request.nextUrl.pathname;
  //   const isProtectedRoute = protectedRoutes.includes(path);

  //   const cookie = cookies().get("accessToken")?.value;

  //   if (!cookie && isProtectedRoute) {
  //     return NextResponse.redirect(new URL("/auth", request.nextUrl));
  //   }

  //   const token = await verifyToken(cookie as string);

  //   if (!token?.username && isProtectedRoute) {
  //     return NextResponse.redirect(new URL("/auth", request.nextUrl));
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
