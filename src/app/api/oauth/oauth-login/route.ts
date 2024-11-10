import { NextRequest, NextResponse } from "next/server";

const promptMap = {
  login: "none",
  register: "consent",
};

export async function GET(request: NextRequest, response: NextResponse) {
  const url = new URL(`${process.env.COGNITO_DOMAIN!}/oauth2/authorize`);
  const authFlow = request.nextUrl.searchParams.get("flow");

  if (!authFlow) return new Response(JSON.stringify({ error: "Flow not found" }), { status: 400 });

  //   const params = {
  //     access_type: "online",
  //     scope: "openid profile email",
  //     client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
  //     response_type: process.env.COGNITO_RESPONSE_TYPE!,
  //     redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL_AUTH_REDIRECT!,
  //     prompt: promptMap[authFlow! as keyof typeof promptMap] || "consent",
  //   };

  const params = {
    scope: process.env.COGNITO_SCOPE!,
    client_id: process.env.COGNITO_CLIENT_ID!,
    response_type: process.env.COGNITO_RESPONSE_TYPE!,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URL_AUTH_REDIRECT!,
    prompt: promptMap[authFlow! as keyof typeof promptMap] || "consent",
  };

  type ParamKey = keyof typeof params;

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key as ParamKey]!));

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
