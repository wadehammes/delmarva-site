import { unstable_cache } from "next/cache";
import { contentfulClient } from "src/contentful/client";
import { type FooterType, parseFooter } from "src/contentful/getFooter";
import {
  type NavigationType,
  parseNavigation,
} from "src/contentful/getNavigation";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  parseContentfulSection,
  type SectionType,
} from "src/contentful/parseSections";
import {
  isTypePage,
  type TypePageFields,
  type TypePageSkeleton,
  type TypePageWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypePage";
import type { Locales } from "src/i18n/routing";
import { REVALIDATE_SECONDS } from "src/utils/constants";
import { createInternalLink } from "src/utils/urlHelpers";

export type PageEntry = TypePageWithoutUnresolvableLinksResponse;

export interface Page {
  enableIndexing: boolean;
  id: string;
  metaDescription: string;
  metaKeywords?: string[];
  metaTitle: string;
  metaImage?: ContentfulAsset | null;
  publishDate: string;
  sections: (SectionType | null)[];
  slug: string;
  title?: string | undefined;
  updatedAt: string;
  navigationOverride?: NavigationType | null;
  footerOverride?: FooterType | null;
}

const _validatePageCheck: ContentfulTypeCheck<
  Page,
  TypePageFields,
  "id" | "updatedAt" | "publishDate"
> = true;

export function parseContentfulPage(pageEntry?: PageEntry): Page | null {
  if (!pageEntry || !isTypePage(pageEntry)) {
    return null;
  }

  const { fields } = pageEntry;

  return {
    enableIndexing: fields.enableIndexing,
    footerOverride: fields.footerOverride
      ? parseFooter(fields.footerOverride)
      : undefined,
    id: pageEntry.sys.id,
    metaDescription: fields.metaDescription,
    metaImage: fields.metaImage
      ? parseContentfulAsset(fields.metaImage)
      : undefined,
    metaKeywords: fields.metaKeywords,
    metaTitle: fields.metaTitle,
    navigationOverride: fields.navigationOverride
      ? parseNavigation(fields.navigationOverride)
      : undefined,
    publishDate: pageEntry.sys.createdAt,
    sections:
      fields.sections?.map((section) => parseContentfulSection(section)) ?? [],
    slug: fields.slug,
    title: fields.title,
    updatedAt: pageEntry.sys.updatedAt,
  };
}

export interface PageForNavigation {
  id: string;
  text: string;
  url: string;
}

// A function to transform a Contentful page for navigation
export function parseContentfulPageForNavigation(
  pageEntry: PageEntry,
): PageForNavigation | null {
  if (!pageEntry || !isTypePage(pageEntry)) {
    return null;
  }

  const page = parseContentfulPage(pageEntry);

  if (!page) {
    return null;
  }

  const url = createInternalLink(page);

  return {
    id: pageEntry.sys.id,
    text: pageEntry.fields.title ?? "",
    url,
  };
}

// A function to fetch all pages.
// Optionally uses the Contentful content preview.
interface FetchPagesOptions {
  preview: boolean;
  locale?: Locales;
}

async function fetchPagesUncached({
  preview,
  locale = "en",
}: FetchPagesOptions): Promise<Page[]> {
  const contentful = contentfulClient({ preview });
  const limit = 10;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allPages: Page[] = [];

  do {
    const pages =
      await contentful.withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
        content_type: "page",
        include: 10,
        limit,
        locale,
        skip,
      });

    const currentPageEntries = pages.items
      .map((pageEntry) => parseContentfulPage(pageEntry) as Page)
      .filter((page) => {
        if (seenIds.has(page.id)) return false;
        seenIds.add(page.id);
        return true;
      });

    total = pages.total;
    skip += limit;

    allPages = [...allPages, ...currentPageEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allPages;
}

const getCachedPages = unstable_cache(
  (locale: string) =>
    fetchPagesUncached({ locale: locale as Locales, preview: false }),
  ["pages"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchPages(opts: FetchPagesOptions): Promise<Page[]> {
  return opts.preview
    ? fetchPagesUncached(opts)
    : getCachedPages(opts.locale ?? "en");
}

// A function to fetch a single page by its slug.
// Optionally uses the Contentful content preview.
interface FetchPageOptions {
  slug: string;
  preview: boolean;
  locale?: string;
}

async function fetchPageUncached({
  slug,
  preview,
  locale = "en",
}: FetchPageOptions): Promise<Page | null> {
  const contentful = contentfulClient({ preview });
  const pagesResult =
    await contentful.withoutUnresolvableLinks.getEntries<TypePageSkeleton>({
      content_type: "page",
      "fields.slug": slug,
      include: 10,
      locale,
    });
  return parseContentfulPage(pagesResult.items[0]);
}

const getCachedPage = unstable_cache(
  (slug: string, locale: string) =>
    fetchPageUncached({
      locale: locale as Locales,
      preview: false,
      slug,
    }),
  ["page"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function fetchPage(opts: FetchPageOptions): Promise<Page | null> {
  return opts.preview
    ? fetchPageUncached(opts)
    : getCachedPage(opts.slug, opts.locale ?? "en");
}
