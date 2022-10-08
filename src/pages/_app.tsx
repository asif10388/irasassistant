import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { AppContainer } from '../comps/AppContainer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
      }}
    >
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </MantineProvider>
  );
}

export default MyApp;
