import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeFooterFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug?: EntryFieldTypes.Symbol;
  copyright?: EntryFieldTypes.Symbol;
  addresscompanyInfo?: EntryFieldTypes.RichText;
  links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton>>;
  linksTitle?: EntryFieldTypes.Symbol;
  otherLinks?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeCtaSkeleton>
  >;
  otherLinksTitle?: EntryFieldTypes.Symbol;
  linkedInUrl?: EntryFieldTypes.Symbol;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFooterSkeleton, Modifiers, Locales>;

export function isTypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeFooter<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "footer";
}

export type TypeFooterWithoutLinkResolutionResponse =
  TypeFooter<"WITHOUT_LINK_RESOLUTION">;
export type TypeFooterWithoutUnresolvableLinksResponse =
  TypeFooter<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeFooterWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<"WITH_ALL_LOCALES", Locales>;
export type TypeFooterWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeFooterWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeFooter<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
