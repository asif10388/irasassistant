import { cookies } from "next/headers";
import { signInWithEmail } from "@lib/auth/cognito";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const signIn = await signInWithEmail(email, password);

  if (signIn.error) {
    return new Response(
      JSON.stringify({ error: signIn.error.message || "Failed to sign in user" }),
      { status: signIn.error.$metadata?.httpStatusCode || 500 }
    );
  }

  cookies().set("idToken", signIn.result?.IdToken!, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  cookies().set("accessToken", signIn.result?.AccessToken!, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  cookies().set("refreshToken", signIn.result?.RefreshToken!, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  return new Response(JSON.stringify({ message: "User logged in successfully" }), { status: 200 });
}
