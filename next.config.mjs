/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },

  env: {
    AWS_REGION: process.env.AWS_REGION,

    COGNITO_SCOPE: process.env.COGNITO_SCOPE,
    COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_LOGOUT_URI: process.env.COGNITO_LOGOUT_URI,
    COGNITO_GRANT_TYPE: process.env.COGNITO_GRANT_TYPE,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
    COGNITO_RESPONSE_TYPE: process.env.COGNITO_RESPONSE_TYPE,
  },
};

export default nextConfig;
