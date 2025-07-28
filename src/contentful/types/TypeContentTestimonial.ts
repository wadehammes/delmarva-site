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
  quoterName?: EntryFieldTypes.Symbol;
  quoterTitle?: EntryFieldTypes.Symbol;
  companyLogo?: EntryFieldTypes.AssetLink;
}

export type TypeContentTestimonialSkeleton = EntrySkeletonType<
  TypeContentTestimonialFields,
  "contentTestimonial"
>;
export type TypeContentTestimonial<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentTestimonialSkeleton, Modifiers, Locales>;
