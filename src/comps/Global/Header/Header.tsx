import Image from "next/image";
import classes from "./Header.module.css";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Container, Group, Burger } from "@mantine/core";

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

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Image src="/favicon.svg" alt="Mantine logo" width={32} height={32} />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
