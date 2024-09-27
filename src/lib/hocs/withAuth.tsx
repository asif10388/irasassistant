import { Loader } from "@mantine/core";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeTokenWithCode, getCurrentUser } from "@lib/services/cognito";

export default function withAuth(Component: React.FC<any>) {
  return function WithAuth(
    props:
      | React.ComponentProps<typeof Component>
      | React.PropsWithChildren<React.ComponentProps<typeof Component>>
  ) {
    const router = useRouter();
    const search = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Prevent double execution in development mode (Strict Mode)
    const isInitialRender = useRef(true);

    useEffect(() => {
      const authenticateUser = async () => {
        const code = search.get("code");
        const accessToken = sessionStorage.getItem("accessToken");

        // Check if access token already exists (avoid unnecessary calls)
        if (accessToken) {
          const user = await getCurrentUser();
          setIsAuthenticated(!!user);
          setLoading(false);
          return;
        }

        // If no access token, and a code exists (Google sign-in flow)
        if (code && !accessToken) {
          const tokenExchangeResult = await exchangeTokenWithCode(code);
          if (tokenExchangeResult) {
            const user = await getCurrentUser();
            setIsAuthenticated(!!user);
          }
        }

        setLoading(false);
      };

      // Avoid running the effect twice in development mode
      if (isInitialRender.current) {
        isInitialRender.current = false;
        authenticateUser();
      }
    }, [router, search]);

    if (loading) return <Loader color="blue" />;

    if (!isAuthenticated) {
      router.push("/auth");
      return null;
    }

    return <Component {...props} />;
  };
}
