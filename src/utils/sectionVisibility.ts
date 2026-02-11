import { hasRecentNews } from "src/contentful/getContentRecentNews";
import type { SectionType } from "src/contentful/parseSections";
import type { Locales } from "src/i18n/routing";
import { sectionContainsRecentNewsList } from "src/utils/contentModules";

export async function filterSectionsByStaleRecentNews(
  sections: (SectionType | null)[],
  locale: Locales,
  preview: boolean,
): Promise<(SectionType | null)[]> {
  const hasRecent = await hasRecentNews({ locale, preview });
  if (hasRecent) return sections;
  return sections.filter((s) => !sectionContainsRecentNewsList(s));
}
