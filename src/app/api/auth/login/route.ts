import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { signInWithEmail } from "@lib/services/cognito";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const { result, error } = await signInWithEmail(email, password);

    if (!result?.AccessToken || !result?.ExpiresIn) {
      return new Response(error, { status: 400 });
    }

    cookies().set("accessToken", result.AccessToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + result.ExpiresIn * 1000),
    });

    return new Response("Logged in successfully", { status: 200 });
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
}
