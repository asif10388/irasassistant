import { NextRequest, NextResponse } from "next/server";
import { confirmSignUpWithEmail, linkGoogleAccountToCognitoUser } from "@lib/auth/cognito";

export async function POST(request: NextRequest, response: NextResponse) {
  const { email, code, googleUserId, googleIdToken } = await request.json();

  if (!email || !code) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const confirmUser = await confirmSignUpWithEmail(email, code);

  if (confirmUser.error) {
    return new Response(
      JSON.stringify({ error: confirmUser.error.message || "Failed to confirm user" }),
      { status: confirmUser.error.$metadata?.httpStatusCode || 500 }
    );
  }

  //   if (username && googleUserId && googleIdToken) {
  //     const linkGoogleAccount = await linkGoogleAccountToCognitoUser(
  //       username,
  //       googleUserId,
  //       googleIdToken
  //     );

  //     if (!linkGoogleAccount) {
  //       return new Response(JSON.stringify({ error: "Failed to link Google account" }), {
  //         status: 400,
  //       });
  //     }
  //   }

  return new Response(JSON.stringify({ message: "User confirmed successfully" }), { status: 200 });
}
