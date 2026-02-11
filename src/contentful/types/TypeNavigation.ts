import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeNavigationFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton>>;
  ctaButton?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<
  TypeNavigationFields,
  "navigation"
>;
export type TypeNavigation<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;

export function isTypeNavigation<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeNavigation<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "navigation";
}

export type TypeNavigationWithoutLinkResolutionResponse =
  TypeNavigation<"WITHOUT_LINK_RESOLUTION">;
export type TypeNavigationWithoutUnresolvableLinksResponse =
  TypeNavigation<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeNavigationWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNavigation<"WITH_ALL_LOCALES", Locales>;
export type TypeNavigationWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNavigation<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeNavigationWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeNavigation<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
