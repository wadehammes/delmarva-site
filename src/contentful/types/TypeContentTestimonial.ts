import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentTestimonialFields {
  entryTitle?: EntryFieldTypes.Symbol;
  quote: EntryFieldTypes.RichText;
  qouter?: EntryFieldTypes.Symbol;
  quoterTitle?: EntryFieldTypes.Symbol;
  quoterLogo?: EntryFieldTypes.AssetLink;
}

export type TypeContentTestimonialSkeleton = EntrySkeletonType<
  TypeContentTestimonialFields,
  "contentTestimonial"
>;
export type TypeContentTestimonial<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentTestimonialSkeleton, Modifiers, Locales>;
