import { draftMode } from "next/headers";
import Providers from "src/app/providers";
import { ExitDraftModeLink } from "src/components/ExitDraftModeLink/ExitDraftModeLink.component";
import "src/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import { SITE_NAME } from "src/utils/constants";
import { envUrl } from "src/utils/env.helpers";
import { getGoogleAnalyticsMeasurementId } from "src/utils/publicEnv";

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    applicationName: SITE_NAME,
    creator: SITE_NAME,
    metadataBase: new URL(`${envUrl()}/`),
    publisher: SITE_NAME,
    title: SITE_NAME,
  };
};

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locales)) {
    return notFound();
  }

  setRequestLocale(locale);

  const draft = await draftMode();
  const googleAnalyticsMeasurementId = getGoogleAnalyticsMeasurementId();

  return (
    <html data-scroll-behavior="smooth" data-theme="dark" lang={locale}>
      {googleAnalyticsMeasurementId ? (
        <GoogleAnalytics gaId={googleAnalyticsMeasurementId} />
      ) : null}
      <head>
        {process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN ? (
          <link
            crossOrigin="anonymous"
            href="https://api.mapbox.com"
            rel="preconnect"
          />
        ) : null}
        <link
          crossOrigin="anonymous"
          href="https://images.ctfassets.net"
          rel="preconnect"
        />
        <link href="https://www.youtube.com" rel="preconnect" />
        <link
          href="/sitemap-index.xml"
          rel="sitemap"
          title="Sitemap"
          type="application/xml"
        />
      </head>
      <body>
        {draft.isEnabled ? (
          <div className="draftMode">
            You are previewing in draft mode!{" "}
            <ExitDraftModeLink style={{ textDecoration: "underline" }} />
          </div>
        ) : null}
        <NextIntlClientProvider locale={locale}>
          <Providers locale={locale as Locales}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
