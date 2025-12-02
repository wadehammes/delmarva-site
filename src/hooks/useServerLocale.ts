import { getLocale as getServerLocale } from "next-intl/server";
import type { Locales } from "src/contentful/interfaces";
import { isValidLocale } from "src/i18n/localeUtils";

/**
 * Server-side helper to get locale from prop or fallback to next-intl
 * This works in server components and should be used instead of getLocale()
 * to avoid headers() calls when locale is available as a prop.
 *
 * @param localeProp - Optional locale from props (preferred to avoid headers() call)
 * @returns The locale, either from prop or from next-intl
 */
export const getServerLocaleSafe = async (
  localeProp?: string,
): Promise<Locales> => {
  // Validate localeProp if provided, otherwise fall back to next-intl's getLocale
  if (localeProp && isValidLocale(localeProp)) {
    return localeProp;
  }

  // Fallback to next-intl's getLocale (uses headers() internally)
  // This should already be validated by next-intl's routing configuration
  return (await getServerLocale()) as Locales;
};
