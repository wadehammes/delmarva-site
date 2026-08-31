import type { Page } from "src/contentful/getPages";
import type { Locales } from "src/i18n/routing";
import { routing } from "src/i18n/routing";
import {
  buildMarketPageSchemaGraphProp,
  buildPageSchemaGraphProp,
  buildServicePageSchemaGraphProp,
} from "src/lib/schema/pageSchemaGraphProp";

export const validateLocale = (locale: string): Locales | null => {
  if (!routing.locales.includes(locale as Locales)) {
    return null;
  }

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
