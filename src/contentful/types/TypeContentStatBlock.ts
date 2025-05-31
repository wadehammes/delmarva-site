import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentStatBlockFields {
  entryTitle: EntryFieldTypes.Symbol;
  statType: EntryFieldTypes.Symbol<"Currency" | "Numerical" | "Percentage">;
  stat: EntryFieldTypes.Number;
  statDescription: EntryFieldTypes.Symbol;
  animateStat?: EntryFieldTypes.Boolean;
}

export type TypeContentStatBlockSkeleton = EntrySkeletonType<
  TypeContentStatBlockFields,
  "contentStatBlock"
>;
export type TypeContentStatBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentStatBlockSkeleton, Modifiers, Locales>;
