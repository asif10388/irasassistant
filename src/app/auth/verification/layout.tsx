import { ReactNode } from "react";
import { AppShell } from "@mantine/core";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <AppShell padding="md">{children}</AppShell>;
};

export default AuthLayout;
