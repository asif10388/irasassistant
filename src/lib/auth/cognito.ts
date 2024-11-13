import axios from "axios";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

import {
  GetIdCommand,
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";

import {
  SignUpCommand,
  GetUserCommand,
  ListUsersCommand,
  AdminGetUserCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  AuthenticationResultType,
  CognitoIdentityProviderClient,
  AdminLinkProviderForUserCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

type CognitoSignInResult = {
  error?: any;
  success: boolean;
  result?: AuthenticationResultType;
};

type CognitoConfirmationResult = {
  error?: any;
  success: boolean;
};

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

export const signUpWithEmail = async (email: string, username: string, password: string) => {
  const params = {
    Email: email,
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
  } catch (error: any) {
    const statusCode = error.$metadata?.httpStatusCode || 500;
    throw { message: error.message || "Failed to sign up with Cognito.", statusCode };
  }
};

export const confirmSignUpWithEmail = async (
  email: string,
  code: string
): Promise<CognitoConfirmationResult> => {
  const params = {
    Username: email,
    ConfirmationCode: code,
    ClientId: process.env.COGNITO_CLIENT_ID,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);

    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.error("Error confirming sign up: ", error);

    return {
      success: false,
      error: (error as Error) || "An unknown error occurred.",
    };
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<CognitoSignInResult> => {
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
    const { AuthenticationResult } = await cognitoClient.send(command, {
      requestTimeout: 10000,
    });

    if (AuthenticationResult) {
      return {
        success: true,
        result: AuthenticationResult,
      };
    }

    return {
      success: false,
      error: "An unknown error occurred.",
    };
  } catch (error: any) {
    console.error("Error signing in: ", error);

    return {
      success: false,
      error: (error as Error) || "An unknown error occurred.",
    };
  }
};

export const signOut = () => {
  sessionStorage.clear();
};

export const getCurrentUser = async (accessToken: string) => {
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
  try {
    const response = await axios.get(`/api/auth/get-token?code=${code}`);
    const { access_token, id_token, refresh_token } = response.data;

    return response;
  } catch (error) {
    console.error("Error signing in: ", error);
    return false;
  }
};

export const linkGoogleAccountToCognitoUser = async (
  username: string,
  googleUserId: string,
  googleIdToken: string
) => {
  const elevatedCognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  console.log(username, googleUserId);

  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    DestinationUser: {
      ProviderAttributeValue: username,
      ProviderName: "Cognito",
    },
    SourceUser: {
      ProviderAttributeName: "Cognito_Subject",
      ProviderAttributeValue: googleUserId,
      ProviderName: "Google",
    },
  };

  try {
    const command = new AdminLinkProviderForUserCommand(params);
    const response = await elevatedCognitoClient.send(command);

    return response;
  } catch (error) {
    console.error("Error linking Google account to Cognito user: ", error);
    return false;
  }
};

export const loginWithGoogle = async (idToken: string) => {
  const cognitoIdentityClient = new CognitoIdentityClient({ region: process.env.AWS_REGION });

  const identityIdResponse = await cognitoIdentityClient.send(
    new GetIdCommand({
      IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID!,
      Logins: {
        "accounts.google.com": idToken,
      },
    })
  );

  const credentialsResponse = await cognitoIdentityClient.send(
    new GetCredentialsForIdentityCommand({
      IdentityId: identityIdResponse.IdentityId!,
      Logins: {
        "accounts.google.com": idToken,
      },
    })
  );

  return credentialsResponse.Credentials;
};

export const getCognitoUser = async (
  username: string,
  accessKeyId: string,
  secretKey: string,
  sessionToken: string
) => {
  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: accessKeyId,
      sessionToken: sessionToken,
      secretAccessKey: secretKey,
    },
  });

  try {
    const command = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: username, // This is the Cognito username
    });

    const user = await cognitoClient.send(command);

    return {
      user: user,
      error: false,
    };
  } catch (error: any) {
    console.log(error.message);
    return {
      user: false,
      error: error.message,
    };
  }
};

export const checkUserExists = async (email: string) => {
  console.log(email, process.env.COGNITO_USER_POOL_ID);

  const elevatedCognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new ListUsersCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Filter: `email = "${email}"`,
  });

  const response = await elevatedCognitoClient.send(command);
  return response.Users && response.Users.length > 0 ? response.Users[0] : null;
};

export const getAllMatchingUsers = async (email: string) => {
  const elevatedCognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new ListUsersCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Filter: `email = "${email}"`,
  });

  const response = await elevatedCognitoClient.send(command);
  return response.Users && response.Users.length > 0 ? response.Users : null;
};

export const deleteCognitoUser = async (username: string) => {
  const elevatedCognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID!,
    Username: username,
  });

  return elevatedCognitoClient.send(command);
};
