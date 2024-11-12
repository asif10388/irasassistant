import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  checkUserExists,
  deleteCognitoUser,
  exchangeTokenWithCode,
  getAllMatchingUsers,
  linkGoogleAccountToCognitoUser,
} from "@lib/auth/cognito";

type RegisterURLParams = {
  name: string;
  email: string;
  googleUserId: string;
  googleIdToken: string;
};

type Identity = {
  userId: string;
  primary: string;
  dateCreated: string;
  providerName: string;
  providerType: string;
  issuer: string | null;
};

export async function GET(request: NextRequest, response: NextResponse) {
  const formData = new URLSearchParams();
  //   const code = request.nextUrl.searchParams.get("code");
  //   if (!code) return new Response(JSON.stringify({ error: "Code not found" }), { status: 400 });

  const id_token = request.nextUrl.searchParams.get("id_token");
  const access_token = request.nextUrl.searchParams.get("access_token");

  if (!id_token || !access_token) {
    return new Response(JSON.stringify({ error: "Token not found" }), { status: 400 });
  }

  try {
    // formData.append("code", code);
    // formData.append("client_id", process.env.COGNITO_CLIENT_ID || "");
    // formData.append("grant_type", process.env.COGNITO_GRANT_TYPE || "");
    // formData.append("redirect_uri", process.env.NEXT_PUBLIC_REDIRECT_URL_AUTH_REDIRECT || "");

    // const cognitoUrl = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

    // const getTokenFromCode = await fetch(cognitoUrl, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },

    //   body: formData.toString(),
    // });

    // const res = await getTokenFromCode.json();
    // console.log("Token data", res);

    const idTokenClaims = JSON?.parse(Buffer?.from(id_token?.split(".")[1], "base64").toString());

    const email = idTokenClaims.email;
    const googleIdentity: Identity = idTokenClaims.identities.find(
      (identity: Identity) => identity.providerType === "Google"
    );

    console.log(idTokenClaims);

    const Users = await getAllMatchingUsers(email);

    const existingUser = Users?.find((user) => !user.Username!.startsWith("google_"));
    const googleUser = Users?.find((user) => user.Username === `google_${googleIdentity.userId}`);

    console.log("\nExisting user", Users, "\n", existingUser, "\n", googleUser, googleIdentity);

    if (existingUser && googleUser) {
      console.log("User has both Cognito and Google accounts");

      const deleteUser = await deleteCognitoUser(googleUser.Username!);

      if (deleteUser.$metadata.httpStatusCode === 200) {
        const linkGoogle = await linkGoogleAccountToCognitoUser(
          existingUser.Username!,
          googleIdentity.userId,
          id_token
        );

        if (linkGoogle) {
          console.log("Successfully linked Google account to Cognito user");

          return new Response(
            JSON.stringify({ reAuthenticate: true, login_hint: idTokenClaims.email! }),
            {
              status: 200,
            }
          );
        }
      }
    }

    cookies().set("idToken", id_token!, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });

    cookies().set("accessToken", access_token!, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "strict",
    });

    return new Response(null, {
      status: 200,
    });

    // return new Response(null, {
    //   status: 302,
    //   headers: {
    //     Location: process.env.NEXT_PUBLIC_REDIRECT_URL_DASHBOARD!,
    //   },
    // });
  } catch (err) {
    console.log(err);

    return new Response(null, {
      status: 302,
      headers: {
        Location: process.env.NEXT_PUBLIC_REDIRECT_URL_LOGIN!,
      },
    });
  }
}
