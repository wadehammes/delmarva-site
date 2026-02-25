import type { Page } from "src/contentful/getPages";
import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { SectionType } from "src/contentful/parseSections";
import { isContentType } from "src/utils/helpers";

/**
 * Checks if a page contains a specific ContentModule type
 * @param page - The page to check
 * @param moduleType - The module type to look for
 * @returns true if the page contains the specified module type
 */
export function hasContentModule(
  page: Page,
  moduleType:
    | "All Services List"
    | "Featured Services List"
    | "Areas Serviced List"
    | "Areas Serviced Map"
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
      if (isContentType(contentEntry, "contentModules")) {
        const moduleEntry = contentEntry as ContentModuleEntry;
        if (
          moduleEntry &&
          "fields" in moduleEntry &&
          moduleEntry.fields?.module === moduleType
        ) {
          return true;
        }
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
    if (isContentType(contentEntry, "contentModules")) {
      const moduleEntry = contentEntry as ContentModuleEntry;
      if (
        moduleEntry &&
        "fields" in moduleEntry &&
        moduleEntry.fields?.module === "Recent News List"
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if a page has any service list module (All Services List or Featured Services List)
 * @param page - The page to check
 * @returns true if the page contains a service list module
 */
export function hasServiceListModule(page: Page): boolean {
  return (
    hasContentModule(page, "All Services List") ||
    hasContentModule(page, "Featured Services List")
  );
}

/**
 * Checks if a page has the Areas Serviced List module
 * @param page - The page to check
 * @returns true if the page contains the Areas Serviced List module
 */
export function hasAreasServicedListModule(page: Page): boolean {
  return hasContentModule(page, "Areas Serviced List");
}
