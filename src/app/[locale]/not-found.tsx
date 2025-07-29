import { setRequestLocale } from "next-intl/server";
import { NotFoundPage } from "src/components/NotFoundPage/NotFoundPage.component";
import { PageLayout } from "src/components/PageLayout/PageLayout.component";
import { fetchFooter } from "src/contentful/getFooter";
import { fetchNavigation } from "src/contentful/getNavigation";
import type { Locales } from "src/contentful/interfaces";
import { getLocale } from "src/i18n/getLocale";
import { FOOTER_ID, NAVIGATION_ID } from "src/utils/constants";

export default async function NotFound({
  params,
}: {
  params?: Promise<{ locale?: Locales }>;
}) {
  // Safely handle the locale parameter
  let locale: Locales = await getLocale();

  try {
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams?.locale) {
        locale = resolvedParams.locale;
      }
    }
  } catch (error) {
    console.warn("Could not resolve locale from params, using default:", error);
  }

  setRequestLocale(locale);

  const navigation = await fetchNavigation({
    locale,
    preview: false,
    slug: NAVIGATION_ID,
  });

  const footer = await fetchFooter({
    locale,
    preview: false,
    slug: FOOTER_ID,
  });

  if (!footer || !navigation) {
    throw new Error("Failed to fetch navigation or footer");
  }

  return (
    <PageLayout footer={footer} navigation={navigation}>
      <NotFoundPage />
    </PageLayout>
  );
}
