import { getRequestConfig } from "next-intl/server";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";

// Import messages statically to avoid dynamic import issues
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

const messages = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  };
});
