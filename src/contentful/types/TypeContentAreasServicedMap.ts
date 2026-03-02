import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentAreasServicedMapFields {
  entryTitle?: EntryFieldTypes.Symbol;
  services: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
}

export type TypeContentAreasServicedMapSkeleton = EntrySkeletonType<
  TypeContentAreasServicedMapFields,
  "contentAreasServicedMap"
>;
export type TypeContentAreasServicedMap<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentAreasServicedMapSkeleton, Modifiers, Locales>;

export function isTypeContentAreasServicedMap<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentAreasServicedMap<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentAreasServicedMap";
}

export type TypeContentAreasServicedMapWithoutLinkResolutionResponse =
  TypeContentAreasServicedMap<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentAreasServicedMapWithoutUnresolvableLinksResponse =
  TypeContentAreasServicedMap<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentAreasServicedMapWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentAreasServicedMap<"WITH_ALL_LOCALES", Locales>;
export type TypeContentAreasServicedMapWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentAreasServicedMap<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentAreasServicedMapWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentAreasServicedMap<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
