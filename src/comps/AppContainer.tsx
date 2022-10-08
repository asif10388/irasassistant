import { AppShell, Header, Footer, Group, Text } from '@mantine/core';
import { useStore } from '../store';
import Navbar from './Navbar';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppContainer = ({ children }: AppShellProps) => {
  const { logout, getToken, authenticated } = useStore((state: any) =>
    state.auth()
  );

  return (
    <AppShell
      styles={{
        main: {
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 ',
        },
      }}
      fixed
      header={<Navbar /> ?? undefined}
    >
      {children}
    </AppShell>
  );
};
