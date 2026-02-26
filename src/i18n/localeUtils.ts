import { notFound } from "next/navigation";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locales {
  return routing.locales.includes(locale as Locales);
}

/**
 * Safely converts a string locale to Locales type
 * Throws an error if the locale is invalid
 */
export function toLocale(locale: string): Locales {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  return locale;
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

/**
 * Validates a locale string and returns it if valid, otherwise throws
 * This is the main function to use in your components
 */
export function validateLocale(locale: string): Locales {
  return toLocale(locale);
}

/**
 * Type for Next.js params that includes locale
 */
export interface LocaleParams {
  locale: string;
}

/**
 * Helper to extract and validate locale from Next.js params
 */
export async function getValidatedLocale(
  params: Promise<LocaleParams>,
): Promise<Locales> {
  const { locale } = await params;
  if (locale.includes(".")) {
    notFound();
  }
  return validateLocale(locale);
}

/**
 * Safely extracts locale from Next.js useParams() result
 * Handles both string and string[] types that Next.js can return
 */
export function extractLocaleFromParams(
  locale: string | string[] | undefined,
): string {
  if (Array.isArray(locale)) {
    return locale[0] || "en";
  }
  return locale || "en";
}

/**
 * Safely extracts and validates locale from Next.js useParams() result
 * Returns a validated Locales type
 */
export function extractAndValidateLocale(
  locale: string | string[] | undefined,
): Locales {
  return toLocaleSafe(extractLocaleFromParams(locale));
}
