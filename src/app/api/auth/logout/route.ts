import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getCognitoUser, getCurrentUser } from "@/lib/auth/cognito";

export async function GET(request: NextRequest, response: NextResponse) {
  // Remove cookies

  if (!request.cookies.get("accessToken") && !request.cookies.get("sessionToken")) {
    return new Response(JSON.stringify({ error: "Access token or session token not found" }), {
      status: 400,
    });
  }

  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });

  return new Response(JSON.stringify({ message: "User logged out successfully" }), { status: 200 });
}
