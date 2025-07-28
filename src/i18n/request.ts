import { getRequestConfig } from "next-intl/server";
import type { Locales } from "src/contentful/interfaces";
import { routing } from "src/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {}, // Empty messages object since we're using Contentful for content
  };
});
