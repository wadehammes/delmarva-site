"use client";

import { useParams } from "next/navigation";
import type { Locale } from "src/components/JoinOurTeamForm/translations";
import { extractAndValidateLocale } from "./localeUtils";

/**
 * Hook to get the current locale from URL params
 * @returns The current locale, defaults to 'en' if not found
 */
export function useClientLocale(): Locale {
  const params = useParams();
  const locale = extractAndValidateLocale(params?.locale);

  // Since translations can come from Contentful, we just return the validated locale
  // The component using this hook should handle missing translations gracefully
  return locale as Locale;
}
