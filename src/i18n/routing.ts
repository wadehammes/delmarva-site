import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Used when no locale matches
  defaultLocale: "en",

  // Only add the locale prefix when needed, like /es/
  localePrefix: "as-needed",
  // A list of all locales that are supported
  locales: ["en", "es"],
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
