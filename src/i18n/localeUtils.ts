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

const OPEN_GRAPH_LOCALE: Record<Locales, string> = {
  en: "en_US",
  es: "es_ES",
};

const SCHEMA_LOCALE: Record<Locales, string> = {
  en: "en-US",
  es: "es-US",
};

export const toSchemaLocale = (locale: Locales): string =>
  SCHEMA_LOCALE[locale];

export const buildOpenGraphLocale = (locale: Locales) => ({
  alternateLocale: routing.locales
    .filter((entry) => entry !== locale)
    .map((entry) => OPEN_GRAPH_LOCALE[entry]),
  locale: OPEN_GRAPH_LOCALE[locale],
});

const buildMetadataRoute = (path: string): string => (path ? `/${path}` : "/");

export const buildCanonicalUrl = (
  path: string,
  locale: Locales,
  baseUrl: string,
): string => buildLocalizedUrl(buildMetadataRoute(path), locale, baseUrl);

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

export const buildMetadataAlternateLanguages = (
  path: string,
  baseUrl: string,
): Record<string, string> => {
  const route = path ? `/${path}` : "/";

  return Object.fromEntries(
    buildHreflangAlternates(route, baseUrl).map(({ href, hreflang }) => [
      hreflang,
      href,
    ]),
  );
};

export const isValidLocale = (locale: string): locale is Locales =>
  routing.locales.includes(locale as Locales);

export const toLocaleSafe = (
  locale: string,
  fallback: Locales = "en",
): Locales => (isValidLocale(locale) ? locale : fallback);
