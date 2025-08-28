import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import type { Entry } from "contentful";
import type { ContentRecentNewsEntry } from "src/contentful/getContentRecentNews";
import type {
  ContentLayout,
  DelmarvaColors,
  Padding,
  Placement,
} from "src/contentful/interfaces";
import type { ContentCarouselEntry } from "src/contentful/parseContentCarousel";
import type { ContentCopyMediaBlockEntry } from "src/contentful/parseContentCopyMediaBlock";
import type { ContentGridEntry } from "src/contentful/parseContentGrid";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import type { ContentImageBlockEntry } from "src/contentful/parseContentImageBlock";
import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { ContentStatBlockEntry } from "src/contentful/parseContentStatBlock";
import type { ContentTestimonialEntry } from "src/contentful/parseContentTestimonial";
import type { ContentVideoBlockEntry } from "src/contentful/parseContentVideoBlock";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { type Cta, parseContentfulCta } from "src/contentful/parseCta";
import type { FormJoinOurTeamEntry } from "src/contentful/parseFormJoinOurTeam";
import type { TypeSectionSkeleton } from "src/contentful/types";

type ContentStyle = "Overlap Section Above" | "Regular";

export type ContentEntries =
  | CopyBlockEntry
  | ContentCarouselEntry
  | ContentHeroEntry
  | ContentModuleEntry
  | ContentGridEntry
  | ContentStatBlockEntry
  | ContentVideoBlockEntry
  | ContentImageBlockEntry
  | ContentCopyMediaBlockEntry
  | ContentTestimonialEntry
  | ContentRecentNewsEntry
  | FormJoinOurTeamEntry
  | undefined;

export interface SectionType {
  backgroundColor: DelmarvaColors;
  content: ContentEntries[] | undefined;
  contentGap?: "Regular" | "No Gap";
  contentLayout: ContentLayout;
  contentStyle: ContentStyle;
  cta?: Cta | null;
  id: string;
  sectionContentPlacement?: Placement;
  sectionEyebrow?: string;
  sectionHeader?: RichTextDocument;
  sectionPadding: Padding;
  slug: string | undefined;
  showSectionSeparator: boolean;
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
    contentGap: section.fields.contentGap,
    contentLayout: section.fields.contentLayout as ContentLayout,
    contentStyle: section.fields.contentStyle ?? "Regular",
    cta: parseContentfulCta(section.fields.cta) ?? undefined,
    id: section.sys.id,
    sectionContentPlacement: section.fields
      .sectionContentPlacement as Placement,
    sectionEyebrow: section.fields.sectionEyebrow,
    sectionHeader: section.fields.sectionHeader,
    sectionPadding: section.fields.sectionPadding as Padding,
    showSectionSeparator: Boolean(section.fields.showSectionSeparator),
    slug: section.fields.slug,
  };
}
