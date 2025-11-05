import { defineRouting } from "next-intl/routing";

export default defineRouting({
  // Used when no locale matches
  defaultLocale: "en",

  // Only add the locale prefix when needed, like /es/
  localePrefix: "as-needed",

  // A list of all locales that are supported
  locales: ["en", "es"],
});
