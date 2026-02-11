import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";

export interface TypeContentGridFields {
  entryTitle?: EntryFieldTypes.Symbol;
  content?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContentImageBlockSkeleton
      | TypeContentStatBlockSkeleton
      | TypeContentVideoBlockSkeleton
      | TypeCopyBlockSkeleton
    >
  >;
  gridLayout?: EntryFieldTypes.Symbol<
    "Four Column" | "Three Column" | "Two Column"
  >;
}

export type TypeContentGridSkeleton = EntrySkeletonType<
  TypeContentGridFields,
  "contentGrid"
>;
export type TypeContentGrid<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentGridSkeleton, Modifiers, Locales>;

export function isTypeContentGrid<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentGrid<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentGrid";
}

export type TypeContentGridWithoutLinkResolutionResponse =
  TypeContentGrid<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentGridWithoutUnresolvableLinksResponse =
  TypeContentGrid<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentGridWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentGrid<"WITH_ALL_LOCALES", Locales>;
export type TypeContentGridWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentGrid<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContentGridWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentGrid<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
