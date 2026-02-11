import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentCardFields {
  entryTitle?: EntryFieldTypes.Symbol;
  media?: EntryFieldTypes.AssetLink;
  mediaType?: EntryFieldTypes.Symbol<"Headshot" | "Regular Image">;
  cardCopy: EntryFieldTypes.RichText;
  modalCopy?: EntryFieldTypes.RichText;
}

export type TypeContentCardSkeleton = EntrySkeletonType<
  TypeContentCardFields,
  "contentCard"
>;
export type TypeContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCardSkeleton, Modifiers, Locales>;

export function isTypeContentCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentCard<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentCard";
}

export type TypeContentCardWithoutLinkResolutionResponse =
  TypeContentCard<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentCardWithoutUnresolvableLinksResponse =
  TypeContentCard<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentCardWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCard<"WITH_ALL_LOCALES", Locales>;
export type TypeContentCardWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCard<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContentCardWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCard<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
