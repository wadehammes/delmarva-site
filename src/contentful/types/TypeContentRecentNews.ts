import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentRecentNewsFields {
  entryTitle?: EntryFieldTypes.Symbol;
  linkTitle: EntryFieldTypes.Symbol;
  linkDescription: EntryFieldTypes.Text;
  linkUrl: EntryFieldTypes.Symbol;
  date: EntryFieldTypes.Date;
}

export type TypeContentRecentNewsSkeleton = EntrySkeletonType<
  TypeContentRecentNewsFields,
  "contentRecentNews"
>;
export type TypeContentRecentNews<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentRecentNewsSkeleton, Modifiers, Locales>;
