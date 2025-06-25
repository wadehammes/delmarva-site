import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  ContentLayout,
  DelmarvaColors,
  Padding,
  Placement,
} from "src/contentful/interfaces";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeSectionSkeleton } from "src/contentful/types";

export type ContentEntries = CopyBlockEntry | ContentHeroEntry | undefined;

export interface SectionType {
  content: ContentEntries[] | undefined;
  id: string;
  slug: string | undefined;
  cta?: Cta | null;
  sectionContentPlacement?: Placement;
  contentLayout: ContentLayout;
  backgroundColor: DelmarvaColors;
  sectionPadding: Padding;
  sectionHeader?: RichTextDocument;
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
    contentLayout: section.fields.contentLayout as ContentLayout,
    backgroundColor: section.fields.backgroundColor as DelmarvaColors,
    sectionPadding: section.fields.sectionPadding as Padding,
    sectionContentPlacement: section.fields
      .sectionContentPlacement as Placement,
    sectionHeader: section.fields.sectionHeader,
    cta: parseContentfulCta(section.fields.cta) ?? undefined,
  };
}
