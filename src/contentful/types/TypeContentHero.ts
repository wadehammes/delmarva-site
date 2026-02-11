import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeContentHeroFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.RichText;
  cta?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
  copyPlacement?: EntryFieldTypes.Symbol<
    "Center" | "Left Aligned" | "Right Aligned"
  >;
  backgroundMedia?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  backgroundMediaSaturation?: EntryFieldTypes.Number<
    0 | 0.1 | 0.2 | 0.3 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
  >;
  overlayColor?: EntryFieldTypes.Symbol<"Black" | "Red" | "Silver" | "White">;
  overlayOpacity?: EntryFieldTypes.Number;
  overlayStyle?: EntryFieldTypes.Symbol<"Microdot" | "Solid Color">;
  heroHeight?: EntryFieldTypes.Symbol<
    "80% Height" | "Full Screen" | "Regular" | "Small"
  >;
}

export type TypeContentHeroSkeleton = EntrySkeletonType<
  TypeContentHeroFields,
  "contentHero"
>;
export type TypeContentHero<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentHeroSkeleton, Modifiers, Locales>;

export function isTypeContentHero<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentHero<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentHero";
}

export type TypeContentHeroWithoutLinkResolutionResponse =
  TypeContentHero<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentHeroWithoutUnresolvableLinksResponse =
  TypeContentHero<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentHeroWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentHero<"WITH_ALL_LOCALES", Locales>;
export type TypeContentHeroWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentHero<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContentHeroWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentHero<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
