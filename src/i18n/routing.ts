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
const navigation = createNavigation(routing);

export const Link = navigation.Link;
export const redirect = navigation.redirect;
export const usePathname = navigation.usePathname;
export const useRouter = navigation.useRouter;
