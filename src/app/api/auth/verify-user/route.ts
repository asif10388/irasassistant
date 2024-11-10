import { getCognitoUser, getCurrentUser } from "@lib/auth/cognito";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const sessionToken = request.cookies.get("sessionToken")?.value;

  const userEmail = request.cookies.get("userEmail")?.value!;
  const secretKey = request.cookies.get("secretKey")?.value!;
  const accessIdKey = request.cookies.get("accessID")?.value!;

  if (!accessToken && !sessionToken) {
    return new Response(JSON.stringify({ error: "Access token or session token not found" }), {
      status: 400,
    });
  }

  if (accessToken) {
    const user = await getCurrentUser(accessToken);

    if (!user) {
      return new Response(JSON.stringify({ error: "Failed to get user" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "User verified successfully" }), { status: 200 });
  }

  if (sessionToken) {
    const user = await getCognitoUser(userEmail, accessIdKey, secretKey, sessionToken);

    if (!user) {
      return new Response(JSON.stringify({ error: "Failed to get user" }), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "User verified successfully" }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid access token or session token" }), {
    status: 400,
  });
}
