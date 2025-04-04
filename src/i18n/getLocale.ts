import { getLocale as getServerLocale } from "next-intl/server";
import type { Locales } from "src/contentful/interfaces";

export const getLocale = async () => {
  const locale = await getServerLocale();

  return locale as Locales;
};
