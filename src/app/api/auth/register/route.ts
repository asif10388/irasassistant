import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, signUpWithEmail } from "@lib/auth/cognito";

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await checkUserExists(email);

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const createUserResponse = await signUpWithEmail(email, username, password);

    if (!createUserResponse) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: statusCode }
    );
  }
}
