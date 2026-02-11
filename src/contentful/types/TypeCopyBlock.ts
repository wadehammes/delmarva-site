import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeCopyBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.RichText;
  slug: EntryFieldTypes.Symbol;
  cta?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
  alignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
  mobileAlignment?: EntryFieldTypes.Symbol<"Center" | "Left" | "Right">;
}

export type TypeCopyBlockSkeleton = EntrySkeletonType<
  TypeCopyBlockFields,
  "copyBlock"
>;
export type TypeCopyBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCopyBlockSkeleton, Modifiers, Locales>;

export function isTypeCopyBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeCopyBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "copyBlock";
}

export type TypeCopyBlockWithoutLinkResolutionResponse =
  TypeCopyBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeCopyBlockWithoutUnresolvableLinksResponse =
  TypeCopyBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeCopyBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCopyBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeCopyBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCopyBlock<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeCopyBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeCopyBlock<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
