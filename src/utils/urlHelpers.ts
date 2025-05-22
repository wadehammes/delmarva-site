import type { Page } from "src/contentful/getPages";

export const isUrl = (url: string) => {
  try {
    new URL(url);

    return true;
  } catch (_e) {
    return false;
  }
};

export const createInternalLink = (page: Page) => {
  return `/${page.slug}`;
};
