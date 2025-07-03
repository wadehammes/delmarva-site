import type { Entry } from "contentful";
import { contentfulClient } from "src/contentful/client";
import type { Locales } from "src/contentful/interfaces";
import type { TypeContentRecentNewsSkeleton } from "src/contentful/types/TypeContentRecentNews";

export interface ContentRecentNewsType {
  id: string;
  linkTitle: string;
  linkDescription: string;
  linkUrl: string;
  date: string;
}

export type ContentRecentNewsEntry =
  | Entry<TypeContentRecentNewsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentRecentNews = (
  recentNews: ContentRecentNewsEntry,
): ContentRecentNewsType | null => {
  if (!recentNews) {
    return null;
  }

  if (!("fields" in recentNews)) {
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
      );

    total = recentNews.total;
    skip += limit;

    allRecentNews = [...allRecentNews, ...currentRecentNewsEntries];

    if (total < limit) {
      break;
    }
  } while (skip < total);

  return allRecentNews;
}
