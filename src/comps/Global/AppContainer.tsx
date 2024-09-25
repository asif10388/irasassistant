"use client";

import Header from "./Header/Header";
// import { useStore } from "../store";
import { AppShell, Group, Text } from "@mantine/core";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppContainer = ({ children }: AppShellProps) => {
  //   const { logout, getToken, authenticated } = useStore((state: any) => state.auth());

  return (
    <AppShell
      styles={{
        main: {
          padding: "0",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
      header={{ height: 100 }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
