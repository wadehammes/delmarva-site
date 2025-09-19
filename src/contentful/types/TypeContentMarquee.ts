import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentCardSkeleton } from "./TypeContentCard";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";

export interface TypeContentMarqueeFields {
  entryTitle?: EntryFieldTypes.Symbol;
  items?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContentCardSkeleton | TypeContentStatBlockSkeleton
    >
  >;
}

export type TypeContentMarqueeSkeleton = EntrySkeletonType<
  TypeContentMarqueeFields,
  "contentMarquee"
>;
export type TypeContentMarquee<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentMarqueeSkeleton, Modifiers, Locales>;
