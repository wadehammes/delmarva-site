import { en } from "./translations.en";
import { es } from "./translations.es";

export const translations = {
  en,
  es,
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof en;
