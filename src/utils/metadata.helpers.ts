import type { Metadata } from "next";
import type { Page } from "src/contentful/getPages";
import type { SectionType } from "src/contentful/parseSections";
import {
  buildCanonicalUrl,
  buildMetadataAlternateLanguages,
  buildOpenGraphLocale,
} from "src/i18n/localeUtils";
import type { Locales } from "src/i18n/routing";
import { SITE_NAME, SITE_NAME_LEGAL } from "src/utils/constants";
import { envUrl } from "src/utils/env.helpers";
import { createMediaUrl } from "src/utils/urlHelpers";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

const resolveMetadataTitle = (title: string): string => {
  let resolved = title.trim();

  while (resolved.endsWith(TITLE_SUFFIX)) {
    resolved = resolved.slice(0, -TITLE_SUFFIX.length).trimEnd();
  }

  return resolved;
};

export const buildDisplayTitle = (title: string): string => {
  const base = resolveMetadataTitle(title);

  if (!base || base === SITE_NAME) {
    return SITE_NAME;
  }

  return `${base}${TITLE_SUFFIX}`;
};

const buildAlternateLanguages = (
  path: string,
  baseUrl: string,
): Record<string, string> => buildMetadataAlternateLanguages(path, baseUrl);

const createMetadataImages = (
  metaImage: { src: string } | null | undefined,
  alt = SITE_NAME_LEGAL,
): Array<{ alt: string; url: string }> => {
  if (metaImage) {
    return [
      {
        alt,
        url: createMediaUrl(metaImage.src),
      },
    ];
  }

  return [
    {
      alt,
      url: `${envUrl()}/opengraph-image.png`,
    },
  ];
};

interface CreateSiteMetadataOptions {
  description: string;
  enableIndexing: boolean;
  imageAlt?: string;
  imageSource: { src: string } | null | undefined;
  locale: Locales;
  path: string;
  title: string;
}

const createSiteMetadata = ({
  description,
  enableIndexing,
  imageAlt,
  imageSource,
  locale,
  path,
  title,
}: CreateSiteMetadataOptions): Metadata => {
  const baseUrl = envUrl();
  const canonicalUrl = buildCanonicalUrl(path, locale, baseUrl);
  const displayTitle = buildDisplayTitle(title);
  const images = createMetadataImages(imageSource, imageAlt);

  return {
    alternates: {
      canonical: new URL(canonicalUrl),
      languages: buildAlternateLanguages(path, baseUrl),
    },
    description,
    openGraph: {
      ...buildOpenGraphLocale(locale),
      description,
      images,
      siteName: SITE_NAME,
      title: displayTitle,
      type: "website",
      url: canonicalUrl,
    },
    robots:
      enableIndexing && process.env.ENVIRONMENT === "production"
        ? "index, follow"
        : "noindex, nofollow",
    title: { absolute: displayTitle },
    twitter: {
      card: "summary_large_image",
      description,
      images,
      title: displayTitle,
    },
  };
};

export const createPageMetadata = (
  page: Page,
  locale: Locales,
  options?: {
    imageAlt?: string;
    path?: string;
    title?: string;
  },
): Metadata => {
  return createSiteMetadata({
    description: page.metaDescription,
    enableIndexing: page.enableIndexing,
    imageAlt: options?.imageAlt,
    imageSource: page.metaImage,
    locale,
    path: options?.path ?? "",
    title: options?.title ?? page.metaTitle,
  });
};

export const createServiceMetadata = (
  service: {
    metaDescription: string;
    metaTitle: string;
    metaImage: { src: string } | null | undefined;
    enableIndexing: boolean;
    slug: string;
    sections?: (SectionType | null)[];
  },
  locale: Locales,
  options?: { pathPrefix?: string },
): Metadata => {
  const pathPrefix = options?.pathPrefix ?? "";
  const path = pathPrefix ? `${pathPrefix}/${service.slug}` : service.slug;

  return createSiteMetadata({
    description: service.metaDescription,
    enableIndexing: service.enableIndexing,
    imageAlt: service.metaTitle,
    imageSource: service.metaImage,
    locale,
    path,
    title: service.metaTitle,
  });
};

export const createMarketMetadata = (
  market: {
    metadataDescription?: string;
    metadataTitle?: string;
    socialImage?: { src: string } | null;
    enableIndexing?: boolean;
    slug: string;
    marketTitle?: string;
  },
  locale: Locales,
  options?: { pathPrefix?: string },
): Metadata => {
  const pathPrefix = options?.pathPrefix ?? "";
  const path = pathPrefix ? `${pathPrefix}/${market.slug}` : market.slug;
  const title = market.metadataTitle ?? market.marketTitle ?? "Market";

  return createSiteMetadata({
    description: market.metadataDescription ?? "",
    enableIndexing: market.enableIndexing ?? false,
    imageAlt: buildDisplayTitle(title),
    imageSource: market.socialImage,
    locale,
    path,
    title,
  });
};

export const createUtilityPageMetadata = (
  locale: Locales,
  options: {
    description?: string;
    path: string;
    title: string;
  },
): Metadata => {
  return {
    ...createSiteMetadata({
      description: options.description ?? "",
      enableIndexing: false,
      imageSource: null,
      locale,
      path: options.path,
      title: options.title,
    }),
    robots: "noindex, nofollow",
  };
};
