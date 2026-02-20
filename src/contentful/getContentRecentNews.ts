import { contentfulClient } from "src/contentful/client";
import type { ContentfulTypeCheck } from "src/contentful/helpers";
import {
  isTypeContentRecentNews,
  type TypeContentRecentNewsFields,
  type TypeContentRecentNewsSkeleton,
  type TypeContentRecentNewsWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeContentRecentNews";
import type { Locales } from "src/i18n/routing";

export interface ContentRecentNewsType {
  id: string;
  linkTitle: string;
  linkDescription: string;
  linkUrl: string;
  date: string;
}

const _validateContentRecentNewsCheck: ContentfulTypeCheck<
  ContentRecentNewsType,
  TypeContentRecentNewsFields,
  "id"
> = true;

export type ContentRecentNewsEntry =
  | TypeContentRecentNewsWithoutUnresolvableLinksResponse
  | undefined;

export const parseContentRecentNews = (
  recentNews: ContentRecentNewsEntry,
): ContentRecentNewsType | null => {
  if (!recentNews || !isTypeContentRecentNews(recentNews)) {
    return null;
  }

  const { linkTitle, linkDescription, linkUrl, date } = recentNews.fields;

  return {
    date,
    id: recentNews.sys.id,
    linkDescription,
    linkTitle,
    linkUrl,
  };
};

interface FetchRecentNewsOptions {
  preview: boolean;
  locale?: Locales;
}

export async function fetchRecentNews({
  preview,
  locale = "en",
}: FetchRecentNewsOptions): Promise<ContentRecentNewsType[]> {
  const contentful = contentfulClient({ preview });

  const limit = 100;
  let total = 0;
  let skip = 0;
  const seenIds = new Set<string>();
  let allRecentNews: ContentRecentNewsType[] = [];

  do {
    const recentNews =
      await contentful.withoutUnresolvableLinks.getEntries<TypeContentRecentNewsSkeleton>(
        {
          content_type: "contentRecentNews",
          "fields.date[gt]": (new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split(".")[0] +
            "Z") as `${number}-${number}-${number}T${number}:${number}:${number}Z`,
          include: 10,
          limit,
          locale,
          skip,
        },
      );

    const currentRecentNewsEntries = recentNews.items
      .map(parseContentRecentNews)
      .filter(
        (recentNews): recentNews is ContentRecentNewsType =>
          recentNews !== null,
      )
      .filter((item) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });

    total = recentNews.total;
    skip += limit;

    allRecentNews = [...allRecentNews, ...currentRecentNewsEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allRecentNews;
}

const oneYearAgoIso = () =>
  `${
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split(".")[0]
  }Z`;

interface HasRecentNewsOptions {
  locale?: Locales;
  preview: boolean;
}

export async function hasRecentNews({
  locale = "en",
  preview,
}: HasRecentNewsOptions): Promise<boolean> {
  const contentful = contentfulClient({ preview });
  const result =
    await contentful.withoutUnresolvableLinks.getEntries<TypeContentRecentNewsSkeleton>(
      {
        content_type: "contentRecentNews",
        "fields.date[gt]":
          oneYearAgoIso() as `${number}-${number}-${number}T${number}:${number}:${number}Z`,
        limit: 1,
        locale,
      },
    );
  return result.items.length > 0;
}
