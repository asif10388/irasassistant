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
      const params = new URLSearchParams(window.location.hash.substring(1));

      const idToken = params.get("id_token");
      const accessToken = params.get("access_token");

      if (accessToken && idToken) {
        const res = await axios.get(`${cbUrl}?access_token=${accessToken}&id_token=${idToken}`);

        if (res?.data?.reAuthenticate) {
          window.location.href = `/api/oauth/oauth-login?flow=login&login_hint=${res.data.login_hint}`;
        }

        router.push("/dashboard");
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
