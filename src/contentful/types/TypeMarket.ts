import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypeMarketFields {
  entryTitle?: EntryFieldTypes.Symbol;
  marketTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  stats?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContentStatBlockSkeleton>
  >;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  metadataTitle?: EntryFieldTypes.Symbol;
  metadataDescription?: EntryFieldTypes.Symbol;
  socialImage?: EntryFieldTypes.AssetLink;
  enableIndexing?: EntryFieldTypes.Boolean;
}

export type TypeMarketSkeleton = EntrySkeletonType<TypeMarketFields, "market">;
export type TypeMarket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeMarketSkeleton, Modifiers, Locales>;

export function isTypeMarket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(entry: unknown): entry is TypeMarket<Modifiers, Locales> {
  const candidate = entry as {
    sys?: { contentType?: { sys?: { id?: string } } };
  };
  return candidate.sys?.contentType?.sys?.id === "market";
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
