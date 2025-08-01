import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeCopyBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.RichText;
  slug: EntryFieldTypes.Symbol;
  cta?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
  alignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  mobileAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
}

export type TypeCopyBlockSkeleton = EntrySkeletonType<
  TypeCopyBlockFields,
  "copyBlock"
>;
export type TypeCopyBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCopyBlockSkeleton, Modifiers, Locales>;
