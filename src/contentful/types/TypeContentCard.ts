import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  media?: EntryFieldTypes.AssetLink;
  mediaType?: EntryFieldTypes.Symbol<"Headshot" | "Regular Image">;
  cardCopy: EntryFieldTypes.RichText;
  modalCopy?: EntryFieldTypes.RichText;
}

export type TypeContentCardSkeleton = EntrySkeletonType<
  TypeContentCardFields,
  "contentCard"
>;
export type TypeContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCardSkeleton, Modifiers, Locales>;
