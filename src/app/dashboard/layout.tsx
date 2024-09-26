import { ReactNode } from "react";
import { AppShell } from "@mantine/core";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <AppShell padding="md">{children}</AppShell>;
};

export default DashboardLayout;
