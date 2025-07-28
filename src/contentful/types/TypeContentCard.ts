import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";

export interface TypeContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  media?: EntryFieldTypes.AssetLink;
  mediaType?: EntryFieldTypes.Symbol<"Icon" | "Image">;
  copy: EntryFieldTypes.EntryLink<TypeCopyBlockSkeleton>;
  cardStyle?: EntryFieldTypes.Symbol<"Headshot" | "Regular">;
}

export type TypeContentCardSkeleton = EntrySkeletonType<
  TypeContentCardFields,
  "contentCard"
>;
export type TypeContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCardSkeleton, Modifiers, Locales>;
