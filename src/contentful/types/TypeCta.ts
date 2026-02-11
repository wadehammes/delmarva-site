import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypePageSkeleton } from "./TypePage";

export interface TypeCtaFields {
  entryTitle?: EntryFieldTypes.Symbol;
  text: EntryFieldTypes.Symbol;
  pageLink?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  externalLink?: EntryFieldTypes.Symbol;
  buttonVariant?: EntryFieldTypes.Symbol<"Primary" | "Secondary">;
  arrow?: EntryFieldTypes.Symbol<"No Arrow" | "Right Arrow" | "Right-Up Arrow">;
}

export type TypeCtaSkeleton = EntrySkeletonType<TypeCtaFields, "cta">;
export type TypeCta<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCtaSkeleton, Modifiers, Locales>;

export function isTypeCta<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeCta<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "cta";
}

export type TypeCtaWithoutLinkResolutionResponse =
  TypeCta<"WITHOUT_LINK_RESOLUTION">;
export type TypeCtaWithoutUnresolvableLinksResponse =
  TypeCta<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCtaWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCta<"WITH_ALL_LOCALES", Locales>;
export type TypeCtaWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCta<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCtaWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCta<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
