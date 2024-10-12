import React from "react";
import "@mantine/core/styles.css";
import { theme } from "../../theme";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";
import { AppContainer } from "@comps/Global/AppContainer";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";

export const metadata = {
  title: "Mantine Next.js template",
  description: "I am using Mantine with Next.js!",
};

type AllowedChildren = React.ReactNode;

export default function RootLayout({ children }: { children: AllowedChildren }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications />
          <AppContainer>{children}</AppContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
