import { NextRequest, NextResponse } from "next/server";

const promptMap = {
  login: "none",
  register: "consent",
};

export async function GET(request: NextRequest, response: NextResponse) {
  const authFlow = request.nextUrl.searchParams.get("flow");
  const loginHint = request.nextUrl.searchParams.get("login_hint");
  const url = new URL(`${process.env.COGNITO_DOMAIN!}/oauth2/authorize`);

  if (!authFlow) return new Response(JSON.stringify({ error: "Flow not found" }), { status: 400 });

  const params = {
    identity_provider: "Google",
    login_hint: loginHint || "",
    scope: process.env.COGNITO_SCOPE!,
    client_id: process.env.COGNITO_CLIENT_ID!,
    response_type: process.env.COGNITO_RESPONSE_TYPE!,
    prompt: promptMap[authFlow! as keyof typeof promptMap] || "consent",
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL_OAUTH_REDIRECT_CLIENT!,
  };

  type ParamKey = keyof typeof params;

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key as ParamKey]!));

  console.log(url.toString());

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
