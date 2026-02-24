import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeMarketFields {
  entryTitle?: EntryFieldTypes.Symbol;
  marketTitle?: EntryFieldTypes.Symbol;
}

export type TypeMarketSkeleton = EntrySkeletonType<TypeMarketFields, "market">;
export type TypeMarket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeMarketSkeleton, Modifiers, Locales>;

export function isTypeMarket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeMarket<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "market";
}

export type TypeMarketWithoutLinkResolutionResponse =
  TypeMarket<"WITHOUT_LINK_RESOLUTION">;
export type TypeMarketWithoutUnresolvableLinksResponse =
  TypeMarket<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeMarketWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMarket<"WITH_ALL_LOCALES", Locales>;
export type TypeMarketWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMarket<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeMarketWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeMarket<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
