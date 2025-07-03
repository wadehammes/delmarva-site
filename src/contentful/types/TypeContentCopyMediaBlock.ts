import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";

export interface TypeContentCopyMediaBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.EntryLink<TypeCopyBlockSkeleton>;
  media?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContentImageBlockSkeleton | TypeContentVideoBlockSkeleton
    >
  >;
  mediaPlacement?: EntryFieldTypes.Symbol<"Left" | "Right">;
}

export type TypeContentCopyMediaBlockSkeleton = EntrySkeletonType<
  TypeContentCopyMediaBlockFields,
  "contentCopyMediaBlock"
>;
export type TypeContentCopyMediaBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCopyMediaBlockSkeleton, Modifiers, Locales>;
