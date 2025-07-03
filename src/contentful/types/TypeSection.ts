import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentCardSkeleton } from "./TypeContentCard";
import type { TypeContentCopyMediaBlockSkeleton } from "./TypeContentCopyMediaBlock";
import type { TypeContentGridSkeleton } from "./TypeContentGrid";
import type { TypeContentHeroSkeleton } from "./TypeContentHero";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentModulesSkeleton } from "./TypeContentModules";
import type { TypeContentRecentNewsSkeleton } from "./TypeContentRecentNews";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeContentTestimonialSkeleton } from "./TypeContentTestimonial";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  sectionEyebrow?: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  content?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContentCardSkeleton
      | TypeContentCopyMediaBlockSkeleton
      | TypeContentGridSkeleton
      | TypeContentHeroSkeleton
      | TypeContentImageBlockSkeleton
      | TypeContentModulesSkeleton
      | TypeContentRecentNewsSkeleton
      | TypeContentStatBlockSkeleton
      | TypeContentTestimonialSkeleton
      | TypeContentVideoBlockSkeleton
      | TypeCopyBlockSkeleton
      | TypeCtaSkeleton
    >
  >;
  cta?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
  sectionContentPlacement?: EntryFieldTypes.Symbol<
    "Center" | "Left Aligned" | "Right Aligned"
  >;
  sectionPadding: EntryFieldTypes.Symbol<
    "Less Padding" | "More Padding" | "No Padding" | "Regular Padding"
  >;
  backgroundColor: EntryFieldTypes.Symbol<
    "Black" | "Red" | "Silver" | "System Default" | "White"
  >;
  contentLayout: EntryFieldTypes.Symbol<
    | "2-column"
    | "3-column"
    | "4-column"
    | "5-column"
    | "6-column"
    | "Full Width"
    | "Single Column"
  >;
  contentStyle?: EntryFieldTypes.Symbol<"Overlap Section Above" | "Regular">;
  contentGap?: EntryFieldTypes.Symbol<"No Gap" | "Regular">;
  showSectionSeparator?: EntryFieldTypes.Boolean;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
