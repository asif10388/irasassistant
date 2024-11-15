import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID || "",
  userPoolId: process.env.COGNITO_USER_POOL_ID || "",
});

export const verifyToken = async (token: string) => {
  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch {
    return null;
  }
};
