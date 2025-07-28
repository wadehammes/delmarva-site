import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeProjectSkeleton } from "./TypeProject";

export interface TypeMarketFields {
  entryTitle?: EntryFieldTypes.Symbol;
  projects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeProjectSkeleton>
  >;
}

export type TypeMarketSkeleton = EntrySkeletonType<TypeMarketFields, "market">;
export type TypeMarket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeMarketSkeleton, Modifiers, Locales>;
