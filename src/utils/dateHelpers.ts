import type { Locales } from "src/i18n/routing";

export const formatDate = (date: string, locale: Locales) => {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });
};
