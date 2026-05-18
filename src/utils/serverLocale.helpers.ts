import { getLocale as getServerLocale } from "next-intl/server";
import { isValidLocale } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";

export const getServerLocaleSafe = async (
  localeProp?: string,
): Promise<Locales> => {
  if (localeProp && isValidLocale(localeProp)) {
    return localeProp;
  }

  return (await getServerLocale()) as Locales;
};
