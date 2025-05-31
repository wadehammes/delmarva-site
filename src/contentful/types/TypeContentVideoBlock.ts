import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentVideoBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  videoUrl: EntryFieldTypes.Symbol;
  videoUpload?: EntryFieldTypes.AssetLink;
}

export type TypeContentVideoBlockSkeleton = EntrySkeletonType<
  TypeContentVideoBlockFields,
  "contentVideoBlock"
>;
export type TypeContentVideoBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentVideoBlockSkeleton, Modifiers, Locales>;
