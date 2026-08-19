import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export type Locales = "en" | "es";
export const locales: Locales[] = ["en", "es"];
export const defaultLocale: Locales = "en";

export const routing = defineRouting({
  defaultLocale: defaultLocale,
  localePrefix: "as-needed",
  locales,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
const navigation = createNavigation(routing);

export const Link = navigation.Link;
export const usePathname = navigation.usePathname;
export const useRouter = navigation.useRouter;

type AppRouter = ReturnType<typeof useRouter>;
type RouterReplaceHref = Parameters<AppRouter["replace"]>[0];

export const replacePageLocale = (
  router: AppRouter,
  pathname: ReturnType<typeof usePathname>,
  params: Record<string, string | string[] | undefined>,
  locale: Locales,
) => {
  router.replace({ params, pathname } as RouterReplaceHref, { locale });
};
