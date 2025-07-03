import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type {
  ContentLayout,
  DelmarvaColors,
  Padding,
  Placement,
} from "src/contentful/interfaces";
import type { ContentGridEntry } from "src/contentful/parseContentGrid";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import type { ContentImageBlockEntry } from "src/contentful/parseContentImageBlock";
import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { ContentStatBlockEntry } from "src/contentful/parseContentStatBlock";
import type { ContentVideoBlockEntry } from "src/contentful/parseContentVideoBlock";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { TypeSectionSkeleton } from "src/contentful/types";

type ContentStyle = "Overlap Section Above" | "Regular";

export type ContentEntries =
  | CopyBlockEntry
  | ContentHeroEntry
  | ContentModuleEntry
  | ContentGridEntry
  | ContentStatBlockEntry
  | ContentVideoBlockEntry
  | ContentImageBlockEntry
  | undefined;

export interface SectionType {
  backgroundColor: DelmarvaColors;
  content: ContentEntries[] | undefined;
  contentLayout: ContentLayout;
  contentStyle: ContentStyle;
  cta?: Cta | null;
  id: string;
  sectionContentPlacement?: Placement;
  sectionHeader?: RichTextDocument;
  sectionPadding: Padding;
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
    backgroundColor: section.fields.backgroundColor as DelmarvaColors,
    content:
      section.fields?.content?.map((entry) => entry as ContentEntries) ?? [],
    contentLayout: section.fields.contentLayout as ContentLayout,
    contentStyle: section.fields.contentStyle as ContentStyle,
    cta: parseContentfulCta(section.fields.cta) ?? undefined,
    id: section.sys.id,
    sectionContentPlacement: section.fields
      .sectionContentPlacement as Placement,
    sectionHeader: section.fields.sectionHeader,
    sectionPadding: section.fields.sectionPadding as Padding,
    slug: section.fields.slug,
  };
}
