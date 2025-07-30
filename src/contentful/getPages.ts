import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import { type FooterType, parseFooter } from "src/contentful/getFooter";
import {
  type NavigationType,
  parseNavigation,
} from "src/contentful/getNavigation";
import type { Locales } from "src/contentful/interfaces";
import {
  type ContentfulAsset,
  parseContentfulAsset,
} from "src/contentful/parseContentfulAsset";
import {
  parseContentfulSection,
  type SectionType,
} from "src/contentful/parseSections";
import type { TypePageSkeleton } from "src/contentful/types/TypePage";
import { createInternalLink } from "src/utils/urlHelpers";

export type PageEntry = Entry<
  TypePageSkeleton,
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

// Our simplified version of a Page.
// We don't need all the data that Contentful gives us.
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
  title: string | undefined;
  updatedAt: string;
  navigationOverride?: NavigationType | null;
  footerOverride?: FooterType | null;
}

// A function to transform a Contentful page
// into our own Page object.
export function parseContentfulPage(pageEntry?: PageEntry): Page | null {
  if (!pageEntry) {
    return null;
  }

  return {
    enableIndexing: pageEntry.fields.enableIndexing,
    footerOverride: pageEntry.fields.footerOverride
      ? parseFooter(pageEntry.fields.footerOverride)
      : undefined,
    id: pageEntry.sys.id,
    metaDescription: pageEntry.fields.metaDescription,
    metaImage: pageEntry.fields.metaImage
      ? parseContentfulAsset(pageEntry.fields.metaImage)
      : undefined,
    metaKeywords: pageEntry.fields.metaKeywords,
    metaTitle: pageEntry.fields.metaTitle,
    navigationOverride: pageEntry.fields.navigationOverride
      ? parseNavigation(pageEntry.fields.navigationOverride)
      : undefined,
    publishDate: pageEntry.sys.createdAt,
    sections:
      pageEntry?.fields?.sections?.map((section) =>
        parseContentfulSection(section),
      ) ?? [],
    slug: pageEntry.fields.slug,
    title: pageEntry.fields.title,
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
  if (!pageEntry) {
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

export async function fetchPages({
  preview,
  locale = "en",
}: FetchPagesOptions): Promise<Page[]> {
  const contentful = contentfulClient({ preview });

  const limit = 10;
  let total = 0;
  let skip = 0;
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

    const currentPageEntries = pages.items.map(
      (pageEntry) => parseContentfulPage(pageEntry) as Page,
    );

    total = pages.total;
    skip += limit;

    allPages = [...allPages, ...currentPageEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allPages;
}

// A function to fetch a single page by its slug.
// Optionally uses the Contentful content preview.
interface FetchPageOptions {
  slug: string;
  preview: boolean;
  locale?: Locales;
}

export async function fetchPage({
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
