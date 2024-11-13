"use client";

import axios from "axios";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const OauthCallbackPage = () => {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    async function handleCallback() {
      const cbUrl = "/api/oauth/oauth-callback";
      const oauthUrl = "/api/oauth/oauth-login";
      const params = new URLSearchParams(window.location.hash.substring(1));

      const idToken = params.get("id_token");
      const accessToken = params.get("access_token");

      if (accessToken && idToken) {
        try {
          const res = await axios.get(`${cbUrl}?access_token=${accessToken}&id_token=${idToken}`);

          if (res?.data?.reAuthenticate) {
            window.location.href = `${oauthUrl}?flow=login&login_hint=${res.data.login_hint}`;
          } else {
            router.push(process.env.NEXT_PUBLIC_REDIRECT_URL_DASHBOARD!);
          }
        } catch (error) {
          console.error("Error handling callback: ", error);
          router.push(process.env.NEXT_PUBLIC_REDIRECT_URL_LOGIN!);
        }
      }
    }

    if (!initialized.current) {
      initialized.current = true;
      handleCallback();
    }
  }, [router]);

  return <div>Redirecting...</div>;
};

export default OauthCallbackPage;
