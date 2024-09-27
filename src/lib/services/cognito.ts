import axios from "axios";

import {
  SignUpCommand,
  GetUserCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const signUpWithEmail = async (email: string, password: string) => {
  const params = {
    Username: email,
    Password: password,
    ClientId: process.env.COGNITO_CLIENT_ID,

    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);

    return response;
  } catch (error) {
    console.error("Error signing up: ", error);
    throw error;
  }
};

export const confirmSignUpWithEmail = async (email: string, code: string) => {
  const params = {
    Username: email,
    ConfirmationCode: code,
    ClientId: process.env.COGNITO_CLIENT_ID,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);

    return true;
  } catch (error) {
    console.error("Error confirming sign up: ", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH" as const,
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await cognitoClient.send(command);

    if (AuthenticationResult) {
      sessionStorage.setItem("idToken", AuthenticationResult.IdToken || "");
      sessionStorage.setItem("accessToken", AuthenticationResult.AccessToken || "");
      sessionStorage.setItem("refreshToken", AuthenticationResult.RefreshToken || "");

      return AuthenticationResult;
    }
  } catch (error) {
    console.error("Error signing in: ", error);
    throw error;
  }
};

export const signOut = () => {
  sessionStorage.clear();
};

export const getCurrentUser = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) return;

  const params = {
    AccessToken: accessToken,
  };

  try {
    const command = new GetUserCommand(params);
    const response = await cognitoClient.send(command);

    return response;
  } catch (error) {
    console.error("Error getting current user: ", error);
    return false;
  }
};

export const exchangeTokenWithCode = async (code: string) => {
  const lambdaUrl = process.env.AWS_LAMBDA_FUNCTION_URL;

  try {
    const response = await axios.get(`${lambdaUrl}?code=${code}`);
    const { access_token, id_token, refresh_token } = response.data;

    sessionStorage.setItem("idToken", id_token);
    sessionStorage.setItem("accessToken", access_token);
    sessionStorage.setItem("refreshToken", refresh_token);

    return response;
  } catch (error) {
    console.error("Error signing in: ", error);
    return false;
  }
};
