import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentHeroSkeleton } from "./TypeContentHero";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeSectionFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  sectionHeader?: EntryFieldTypes.RichText;
  content?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContentHeroSkeleton
      | TypeContentStatBlockSkeleton
      | TypeCopyBlockSkeleton
      | TypeCtaSkeleton
    >
  >;
  cta?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
  sectionContentPlacement?: EntryFieldTypes.Symbol<
    "Center" | "Left Aligned" | "Right Aligned"
  >;
  contentLayout: EntryFieldTypes.Symbol<
    "2-column" | "3-column" | "4-column" | "Full Width"
  >;
  backgroundColor: EntryFieldTypes.Symbol<
    "Black" | "Red" | "Silver" | "System Default" | "White"
  >;
  sectionPadding: EntryFieldTypes.Symbol<
    "Less Padding" | "More Padding" | "No Padding" | "Regular Padding"
  >;
}

export type TypeSectionSkeleton = EntrySkeletonType<
  TypeSectionFields,
  "section"
>;
export type TypeSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeSectionSkeleton, Modifiers, Locales>;
