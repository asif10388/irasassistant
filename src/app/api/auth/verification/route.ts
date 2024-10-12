import { NextRequest } from "next/server";
import { confirmSignUpWithEmail } from "@lib/services/cognito";

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationCode } = await request.json();

    if (!email || !confirmationCode) {
      return new Response("Email and code are required", { status: 400 });
    }

    const response = await confirmSignUpWithEmail(email, confirmationCode);
    if (!response) return new Response("Error confimring user", { status: 400 });

    return new Response("User confirmed successfully", { status: 200 });
  } catch (error) {
    console.error("Error confirming user: ", error);
    throw error;
  }
}
