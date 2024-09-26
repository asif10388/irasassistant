import axios from "axios";
import { Loader } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@lib/services/cognito";

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

    useEffect(() => {
      (async () => {
        const user = await getCurrentUser();
        const authorization_code = search.get("code");
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken || !user) {
          if (authorization_code) {
            console.log(authorization_code);

            try {
              //   const getToken = await axios.post(
              //     `${process.env.COGNITO_DOMAIN}/oauth2/token?client_id=${process.env.COGNITO_CLIENT_ID}&code=${authorization_code}&grant_type=${process.env.COGNITO_GRANT_TYPE}&redirect_uri=${process.env.COGNITO_REDIRECT_URI}`,
              //     {
              //       headers: {
              //         "Content-Type": "application/x-www-form-urlencoded",
              //       },
              //     }
              //   );

              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://irasassistant.auth.us-east-1.amazoncognito.com/oauth2/token?client_id=7l0h2agvntoic1qoo4m582as7f&code=${authorization_code}&grant_type=authorization_code&redirect_uri=http://localhost:3000/dashboard`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              };

              axios
                .request(config)
                .then((response) => {
                  sessionStorage.setItem("idToken", response.data.idToken);
                  sessionStorage.setItem("accessToken", response.data.accessToken);
                  sessionStorage.setItem("refreshToken", response.data.refreshToken);
                })
                .catch((error) => {
                  console.log(error);
                });

              setIsAuthenticated(true);
            } catch (error) {
              console.error("Error signing in: ", error);
              //   router.push("/auth");
              console.log("Error signing in: ", error);
            }
          }
        } else setIsAuthenticated(true);

        setLoading(false);
      })();
    }, [router, search]);

    if (loading) return <Loader color="blue" />;
    return isAuthenticated ? <Component {...props} /> : null;
  };
}
