import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";

export interface TypeContentGridFields {
  entryTitle?: EntryFieldTypes.Symbol;
  content?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContentImageBlockSkeleton
      | TypeContentStatBlockSkeleton
      | TypeContentVideoBlockSkeleton
      | TypeCopyBlockSkeleton
    >
  >;
  gridLayout?: EntryFieldTypes.Symbol<
    "Four Column" | "Three Column" | "Two Column"
  >;
}

export type TypeContentGridSkeleton = EntrySkeletonType<
  TypeContentGridFields,
  "contentGrid"
>;
export type TypeContentGrid<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentGridSkeleton, Modifiers, Locales>;
