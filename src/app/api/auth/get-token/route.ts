import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return new Response("Missing authorization code", { status: 400 });

  try {
    const formData = new URLSearchParams();
    formData.append("code", code);
    formData.append("client_id", process.env.COGNITO_CLIENT_ID || "");
    formData.append("grant_type", process.env.COGNITO_GRANT_TYPE || "");
    formData.append("redirect_uri", process.env.NEXT_PUBLIC_REDIRECT_URL_AUTH_REDIRECT || "");

    const cognitoUrl = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const res = await fetch(cognitoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: formData.toString(),
    });

    const tokenData = await res.json();
    if (res.status !== 200) return new Response(tokenData.error_description, { status: 400 });

    return new Response(JSON.stringify(tokenData), { status: 200 });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: err.message,
      }),
      { status: 500 }
    );
  }
}
