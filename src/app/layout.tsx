import React from "react";
import "@mantine/core/styles.css";
import { theme } from "../../theme";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { AppContainer } from "../comps/Global/AppContainer";

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
          <AppContainer>{children}</AppContainer>
        </MantineProvider>
      </body>
    </html>
  );
}
