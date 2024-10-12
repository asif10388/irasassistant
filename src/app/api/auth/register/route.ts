import { NextRequest } from "next/server";
import { signUpWithEmail } from "@lib/services/cognito";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    const response = await signUpWithEmail(email, password);

    if (!response) {
      return new Response("Error signing up", { status: 400 });
    }

    return new Response("Signed up successfully", { status: 200 });
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
}
