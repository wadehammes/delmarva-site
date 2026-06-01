import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";

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
