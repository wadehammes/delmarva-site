import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFooterFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug?: EntryFieldTypes.Symbol;
  copyright?: EntryFieldTypes.Symbol;
  addresscompanyInfo?: EntryFieldTypes.RichText;
  links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFooterSkeleton, Modifiers, Locales>;
