import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCognitoUser, getCurrentUser } from "@lib/auth/cognito";

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

    const isInitialRender = useRef(true);

    useEffect(() => {
      const authenticateUser = async () => {
        try {
          const res = await axios.get("/api/auth/verify-user", {
            withCredentials: true,
          });

          if (res.status === 200) {
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          setLoading(false);
        }
      };

      if (isInitialRender.current) {
        isInitialRender.current = false;
        authenticateUser();
      }
    }, [router, search]);

    if (loading) return <p>Loading...</p>;

    if (!isAuthenticated) {
      router.push(process.env.NEXT_PUBLIC_REDIRECT_URL_LOGIN!);
      return null;
    }

    return <Component {...props} />;
  };
}
