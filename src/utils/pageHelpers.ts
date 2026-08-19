import { setRequestLocale } from "next-intl/server";
import type { Page } from "src/contentful/getPages";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import {
  buildMarketPageSchemaGraphProp,
  buildPageSchemaGraphProp,
  buildServicePageSchemaGraphProp,
} from "src/lib/schema/pageSchemaGraphProp";

export const validateAndSetLocale = async (
  locale: string,
): Promise<Locales | null> => {
  if (!routing.locales.includes(locale as Locales)) {
    return null;
  }

  setRequestLocale(locale);
  return locale as Locales;
};

export const generatePageSchemaGraph = (
  page: Page,
  slug: string,
  locale: Locales,
  preview: boolean,
): Promise<string | null> =>
  buildPageSchemaGraphProp(page, slug, locale, preview);

export { buildMarketPageSchemaGraphProp, buildServicePageSchemaGraphProp };
