import type { Page, PageForNavigation } from "src/contentful/getPages";

export const isUrl = (url: string) => {
  try {
    new URL(url);

    return true;
  } catch (_e) {
    return false;
  }
};

export const createInternalLink = (page: Page | PageForNavigation) => {
  if ("slug" in page) {
    // This is a Page type
    return `/${page.slug}`;
  }
  // This is a PageForNavigation type
  return page.url;
};
