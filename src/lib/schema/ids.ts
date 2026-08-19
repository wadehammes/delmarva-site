import { buildLocalizedUrl } from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import { envUrl } from "src/utils/env.helpers";

const siteRootUrl = (): string => `${envUrl()}/`;

export const organizationId = (): string => `${siteRootUrl()}#organization`;

export const webSiteId = (): string => `${siteRootUrl()}#website`;

export const brandId = (): string => `${siteRootUrl()}#brand`;

export const logoId = (): string => `${siteRootUrl()}#logo`;

export const localizedSiteUrl = (locale: Locales): string => {
  const url = buildLocalizedUrl("", locale, envUrl());
  return url.endsWith("/") ? url : `${url}/`;
};

export const webPageId = (pageUrl: string): string => `${pageUrl}#webpage`;

export const primaryImageId = (pageUrl: string): string =>
  `${pageUrl}#primaryimage`;

export const serviceId = (serviceUrl: string): string =>
  `${serviceUrl}#service`;

export const itemListId = (pageUrl: string): string => `${pageUrl}#itemlist`;
