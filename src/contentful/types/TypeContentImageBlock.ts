import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentImageBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image: EntryFieldTypes.AssetLink;
  caption?: EntryFieldTypes.RichText;
  captionPlacement: EntryFieldTypes.Symbol<"Above" | "Below">;
  imageStyle: EntryFieldTypes.Symbol<
    "Black Background" | "Bordered" | "None" | "White Background"
  >;
}

export type TypeContentImageBlockSkeleton = EntrySkeletonType<
  TypeContentImageBlockFields,
  "contentImageBlock"
>;
export type TypeContentImageBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentImageBlockSkeleton, Modifiers, Locales>;
