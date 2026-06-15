import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";

const toPathSegment = (route: string): string => {
  if (!route || route === "/") {
    return "";
  }

  return route.startsWith("/") ? route : `/${route}`;
};

export const buildLocalizedUrl = (
  route: string,
  locale: Locales,
  baseUrl: string,
): string => {
  const pathSegment = toPathSegment(route);

  if (locale === routing.defaultLocale) {
    return `${baseUrl}${pathSegment}`;
  }

  return `${baseUrl}/${locale}${pathSegment}`;
};

export const buildHreflangAlternates = (
  route: string,
  baseUrl: string,
): Array<{ href: string; hreflang: string }> => [
  ...routing.locales.map((locale) => ({
    href: buildLocalizedUrl(route, locale, baseUrl),
    hreflang: locale,
  })),
  {
    href: buildLocalizedUrl(route, routing.defaultLocale, baseUrl),
    hreflang: "x-default",
  },
];

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locales {
  return routing.locales.includes(locale as Locales);
}

/**
 * Safely converts a string locale to Locales type with fallback
 * Returns the fallback locale if the input is invalid
 */
export function toLocaleSafe(
  locale: string,
  fallback: Locales = "en",
): Locales {
  return isValidLocale(locale) ? locale : fallback;
}
