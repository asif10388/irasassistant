import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Authorization code is required" }, { status: 400 });
  }

  const data = new URLSearchParams();
  data.append("code", code);
  data.append("grant_type", "authorization_code");
  data.append("redirect_uri", "http://localhost:3000/dashboard");
  data.append("client_id", process.env.COGNITO_CLIENT_ID || "");

  try {
    const response = await axios.post(
      "https://irasassistant.auth.us-east-1.amazoncognito.com/oauth2/token",
      data.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
  }
}
