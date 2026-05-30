import type { ReactNode } from "react";
import { Body, Container, Head, Html, Preview, Tailwind } from "react-email";
import { emailClasses } from "./emailClasses";
import { emailTailwindConfig } from "./emailTheme";

interface EmailLayoutProps {
  /** Inbox preview line; also used for `<title>` when `title` is omitted. */
  preview: string;
  title?: string;
  children: ReactNode;
}

export function EmailLayout({ preview, title, children }: EmailLayoutProps) {
  const documentTitle = title ?? preview;

  return (
    <Html lang="en">
      <Head>
        <title>{documentTitle}</title>
        <meta content="dark" name="color-scheme" />
        <meta content="dark" name="supported-color-schemes" />
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className={emailClasses.body}>
          <Container className={emailClasses.container}>{children}</Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
