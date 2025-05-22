import type { Locales } from "src/contentful/interfaces";

export const formatDate = (date: string, locale: Locales) => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
