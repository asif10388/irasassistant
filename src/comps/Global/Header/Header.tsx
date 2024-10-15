import Image from "next/image";
import classes from "./Header.module.css";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Container, Group, Button } from "@mantine/core";
import { revokeOAuthToken } from "@lib/auth/cognito";

const links = [
  { link: "/", label: "Home" },
  { link: "/auth", label: "Auth" },
];

export default function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    setActive(typeof window === "undefined" ? null : window.location.pathname);
  }, []);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
    >
      {link.label}
    </a>
  ));

  const logout = async () => {
    try {
      const revoke = await revokeOAuthToken();
      if (!revoke) throw new Error("Error revoking token");

      sessionStorage.clear();

      window.location.href = `${process.env.COGNITO_DOMAIN}/logout?client_id=${process.env.COGNITO_CLIENT_ID}&response_type=${process.env.COGNITO_RESPONSE_TYPE}&logout_uri=${process.env.COGNITO_LOGOUT_URI}&redirect_uri=${process.env.COGNITO_REDIRECT_URI}`;
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Image src="/favicon.svg" alt="Mantine logo" width={32} height={32} />

        <Group gap={5}>
          {items}
          <Button onClick={logout} aria-label="Logout" variant="light">
            Logout
          </Button>
        </Group>
      </Container>
    </header>
  );
}
