import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentRecentNewsFields {
  entryTitle?: EntryFieldTypes.Symbol;
  linkTitle: EntryFieldTypes.Symbol;
  linkDescription: EntryFieldTypes.Text;
  linkUrl: EntryFieldTypes.Symbol;
  date: EntryFieldTypes.Date;
}

export type TypeContentRecentNewsSkeleton = EntrySkeletonType<
  TypeContentRecentNewsFields,
  "contentRecentNews"
>;
export type TypeContentRecentNews<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentRecentNewsSkeleton, Modifiers, Locales>;

export function isTypeContentRecentNews<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentRecentNews<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentRecentNews";
}

export type TypeContentRecentNewsWithoutLinkResolutionResponse =
  TypeContentRecentNews<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentRecentNewsWithoutUnresolvableLinksResponse =
  TypeContentRecentNews<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentRecentNewsWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentRecentNews<"WITH_ALL_LOCALES", Locales>;
export type TypeContentRecentNewsWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentRecentNews<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentRecentNewsWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentRecentNews<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
