import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentStatBlockFields {
  entryTitle: EntryFieldTypes.Symbol;
  statType: EntryFieldTypes.Symbol<"Currency" | "Numerical" | "Percentage">;
  stat: EntryFieldTypes.Number;
  statDescription: EntryFieldTypes.Symbol;
  decorator?: EntryFieldTypes.Symbol<"None" | "Plus Sign">;
  statServiceReference?: EntryFieldTypes.EntryLink<TypeServiceSkeleton>;
}

export type TypeContentStatBlockSkeleton = EntrySkeletonType<
  TypeContentStatBlockFields,
  "contentStatBlock"
>;
export type TypeContentStatBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentStatBlockSkeleton, Modifiers, Locales>;
