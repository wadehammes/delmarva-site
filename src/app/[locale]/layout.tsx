import { draftMode } from "next/headers";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import "src/styles/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";
import { envUrl } from "src/utils/helpers";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locales }>;
}

export function generateMetadata(): Metadata {
  return {
    creator: "Delmarva Site Development",
    metadataBase: new URL(`${envUrl()}/`),
    publisher: "Delmarva Site Development",
  };
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();

  return (
    <html lang={locale}>
      <GoogleTagManager gtmId={process.env.GOOGLE_TAG_MANAGER_ID as string} />
      <head>
        <link
          href="/sitemap-index.xml"
          rel="sitemap"
          title="Sitemap"
          type="application/xml"
        />
        <link href="https://use.typekit.net/qbb6tfy.css" rel="stylesheet" />
      </head>
      <body>
        {draft.isEnabled ? (
          <div className="draftMode">
            You are previewing in draft mode!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </div>
        ) : null}
        <NextIntlClientProvider locale={locale} messages={{}}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
