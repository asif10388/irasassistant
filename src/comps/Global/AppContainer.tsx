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
      header={{ height: 50 }}
      styles={{
        main: {
          padding: "0",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
