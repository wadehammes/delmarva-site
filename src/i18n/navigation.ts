import { createNavigation } from "next-intl/navigation";
import { type Locales, routing } from "./routing";

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
