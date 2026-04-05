import type { Page, PageForNavigation } from "src/contentful/getPages";
import type { Cta } from "src/contentful/parseCta";

export const createMediaUrl = (src: string) => {
  if (!src) {
    return "";
  }

  if (src.startsWith("https://")) {
    return src;
  }

  if (src.startsWith("http://")) {
    return src.replace(/^http:\/\//i, "https://");
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  return `https://${src}`;
};

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

export const parseCtaUrl = (cta: Cta) => {
  let url = cta?.externalLink;

  if (!url && cta.pageLink) {
    url = createInternalLink(cta.pageLink);
  }

  return url;
};
