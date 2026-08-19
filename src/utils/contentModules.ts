import type { Page } from "src/contentful/getPages";
import type { SectionType } from "src/contentful/parseSections";
import { isTypeContentModules } from "src/contentful/types";

export function hasContentModule(
  page: Page,
  moduleType:
    | "All Services List"
    | "Featured Services List"
    | "Areas Serviced List"
    | "Recent News List"
    | "Request a Proposal Form",
): boolean {
  if (!page.sections || page.sections.length === 0) {
    return false;
  }

  for (const section of page.sections) {
    if (!section?.content || section.content.length === 0) {
      continue;
    }

    for (const contentEntry of section.content) {
      if (
        isTypeContentModules(contentEntry) &&
        contentEntry.fields?.module === moduleType
      ) {
        return true;
      }
    }
  }

  return false;
}

export function sectionContainsRecentNewsList(
  section: SectionType | null,
): boolean {
  if (!section?.content?.length) return false;
  for (const contentEntry of section.content) {
    if (
      isTypeContentModules(contentEntry) &&
      contentEntry.fields?.module === "Recent News List"
    ) {
      return true;
    }
  }
  return false;
}

export function hasAreasServicedListModule(page: Page): boolean {
  return hasContentModule(page, "Areas Serviced List");
}
