"use client";

import type { Locale } from "next-intl";
import { useLocale } from "next-intl";

export function useClientLocale(): Locale {
  return useLocale() as Locale;
}
