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
  showQuoteIcon?: EntryFieldTypes.Boolean;
}

export type TypeContentTestimonialSkeleton = EntrySkeletonType<
  TypeContentTestimonialFields,
  "contentTestimonial"
>;
export type TypeContentTestimonial<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentTestimonialSkeleton, Modifiers, Locales>;

export function isTypeContentTestimonial<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentTestimonial<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentTestimonial";
}

export type TypeContentTestimonialWithoutLinkResolutionResponse =
  TypeContentTestimonial<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentTestimonialWithoutUnresolvableLinksResponse =
  TypeContentTestimonial<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentTestimonialWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentTestimonial<"WITH_ALL_LOCALES", Locales>;
export type TypeContentTestimonialWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentTestimonial<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentTestimonialWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentTestimonial<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
