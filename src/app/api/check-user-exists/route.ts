import { NextRequest, NextResponse } from "next/server";

import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const email = req.nextUrl.searchParams.get("email");

  if (!email || typeof email !== "string") {
    return new Response("Missing email query parameter", { status: 400 });
  }

  console.log("Checking user existence for email:", email, process.env.COGNITO_USER_POOL_ID!);

  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Filter: `email = "${email}"`,
    });

    const response = await cognitoClient.send(command);

    if (response.Users && response.Users.length > 0) {
      return new Response(JSON.stringify({ exists: true, user: response.Users[0] }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
