import { defineRouting } from "next-intl/routing";

export type Locales = "en" | "es";
export const locales: Locales[] = ["en", "es"];
export const defaultLocale: Locales = "en";

export const routing = defineRouting({
  defaultLocale: defaultLocale,
  localePrefix: "as-needed",
  locales,
});
