import type { Document as RichTextDocument } from "@contentful/rich-text-types";
import type { ContentRecentNewsEntry } from "src/contentful/getContentRecentNews";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ContentCardEntry } from "src/contentful/parseContentCard";
import type { ContentCarouselEntry } from "src/contentful/parseContentCarousel";
import type { ContentCopyMediaBlockEntry } from "src/contentful/parseContentCopyMediaBlock";
import type { ContentGridEntry } from "src/contentful/parseContentGrid";
import type { ContentHeroEntry } from "src/contentful/parseContentHero";
import type { ContentImageBlockEntry } from "src/contentful/parseContentImageBlock";
import type { ContentMarqueeEntry } from "src/contentful/parseContentMarquee";
import type { ContentModuleEntry } from "src/contentful/parseContentModules";
import type { ContentStatBlockEntry } from "src/contentful/parseContentStatBlock";
import type { ContentTestimonialEntry } from "src/contentful/parseContentTestimonial";
import type { ContentVideoBlockEntry } from "src/contentful/parseContentVideoBlock";
import type { CopyBlockEntry } from "src/contentful/parseCopyBlock";
import { type CtaType, parseContentfulCta } from "src/contentful/parseCta";
import type { FormJoinOurTeamEntry } from "src/contentful/parseFormJoinOurTeam";
import {
  isTypeSection,
  type TypeSectionFields,
  type TypeSectionWithoutUnresolvableLinksResponse,
} from "src/contentful/types/TypeSection";

type SectionBackgroundColor = ExtractSymbolType<
  NonNullable<TypeSectionFields["backgroundColor"]>
>;
type SectionContentGap = ExtractSymbolType<
  NonNullable<TypeSectionFields["contentGap"]>
>;
type SectionContentLayout = ExtractSymbolType<
  NonNullable<TypeSectionFields["contentLayout"]>
>;
type SectionOverlayStyle = ExtractSymbolType<
  NonNullable<TypeSectionFields["sectionBackgroundStyle"]>
>;
type SectionPadding = ExtractSymbolType<
  NonNullable<TypeSectionFields["sectionPadding"]>
>;
type SectionContentPlacement = ExtractSymbolType<
  NonNullable<TypeSectionFields["sectionContentPlacement"]>
>;
type SectionVerticalAlignment = ExtractSymbolType<
  NonNullable<TypeSectionFields["contentVerticalAlignment"]>
>;
type SectionMobileContentLayout = ExtractSymbolType<
  NonNullable<TypeSectionFields["mobileContentLayout"]>
>;

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
  | ContentCardEntry
  | ContentMarqueeEntry
  | undefined;

export interface SectionType {
  id: string;
  slug: string;
  backgroundColor: SectionBackgroundColor;
  contentLayout: SectionContentLayout;
  mobileContentLayout?: SectionMobileContentLayout;
  sectionPadding: SectionPadding;
  content?: (ContentEntries | null)[];
  contentGap?: SectionContentGap;
  contentVerticalAlignment?: SectionVerticalAlignment;
  cta?: CtaType | null;
  sectionBackgroundStyle?: SectionOverlayStyle;
  sectionContentPlacement?: SectionContentPlacement;
  sectionEyebrow?: string;
  sectionHeader?: RichTextDocument;
  showSectionSeparator?: boolean;
}

const _validateSectionCheck: ContentfulTypeCheck<
  SectionType,
  TypeSectionFields,
  "id"
> = true;

type SectionEntry = TypeSectionWithoutUnresolvableLinksResponse | undefined;

export function parseContentfulSection(
  section: SectionEntry,
): SectionType | null {
  if (!section || !isTypeSection(section)) {
    return null;
  }

  const { fields } = section;

  return {
    backgroundColor: fields.backgroundColor as SectionBackgroundColor,
    content: fields.content?.map((entry) => entry as ContentEntries) ?? [],
    contentGap: fields.contentGap as SectionContentGap,
    contentLayout: fields.contentLayout as SectionContentLayout,
    contentVerticalAlignment:
      fields.contentVerticalAlignment as SectionVerticalAlignment,
    cta: parseContentfulCta(fields.cta) ?? undefined,
    id: section.sys.id,
    mobileContentLayout:
      fields.mobileContentLayout as SectionMobileContentLayout,
    sectionBackgroundStyle:
      fields.sectionBackgroundStyle as SectionOverlayStyle,
    sectionContentPlacement:
      fields.sectionContentPlacement as SectionContentPlacement,
    sectionEyebrow: fields.sectionEyebrow,
    sectionHeader: fields.sectionHeader,
    sectionPadding: fields.sectionPadding as SectionPadding,
    showSectionSeparator: Boolean(fields.showSectionSeparator),
    slug: fields.slug,
  };
}
