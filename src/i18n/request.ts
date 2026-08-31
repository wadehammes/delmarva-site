import * as rootParams from "next/root-params";
import { getRequestConfig } from "next-intl/server";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";

const messages = {
  en: enMessages,
  es: esMessages,
};

export default getRequestConfig(async ({ locale: localeOverride }) => {
  let locale = localeOverride;

  if (!locale) {
    locale = await rootParams.locale();
  }

  if (!locale || !routing.locales.includes(locale as Locales)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages],
  };
});
