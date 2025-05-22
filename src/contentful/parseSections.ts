import type { Entry } from "contentful";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import type { TypeSectionSkeleton } from "src/contentful/types";

export type ContentEntries = CopyBlockEntry | undefined;

export interface SectionType {
  content: ContentEntries[] | undefined;
  id: string;
  slug: string | undefined;
}

export type SectionEntry =
  | Entry<TypeSectionSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export function parseContentfulSection(
  section: SectionEntry,
): SectionType | null {
  if (!section || !("fields" in section)) {
    return null;
  }

  return {
    content:
      section.fields?.content?.map((entry) => entry as ContentEntries) ?? [],
    id: section.sys.id,
    slug: section.fields.slug,
  };
}
