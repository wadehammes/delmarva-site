import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypePageFields {
  entryTitle?: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  metaTitle: EntryFieldTypes.Symbol;
  metaDescription: EntryFieldTypes.Symbol;
  metaKeywords?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  enableIndexing: EntryFieldTypes.Boolean;
  navigationOverride?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypePageSkeleton, Modifiers, Locales>;
