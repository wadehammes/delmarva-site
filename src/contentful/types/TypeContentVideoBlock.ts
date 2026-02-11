import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeProjectSkeleton } from "./TypeProject";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentVideoBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  videoUrl?: EntryFieldTypes.Symbol;
  videoUpload?: EntryFieldTypes.AssetLink;
  videoBackgroundStyle?: EntryFieldTypes.Symbol<
    "Black Background" | "Microdot Background" | "None"
  >;
  services?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
  projects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeProjectSkeleton>
  >;
}

export type TypeContentVideoBlockSkeleton = EntrySkeletonType<
  TypeContentVideoBlockFields,
  "contentVideoBlock"
>;
export type TypeContentVideoBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentVideoBlockSkeleton, Modifiers, Locales>;

export function isTypeContentVideoBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentVideoBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentVideoBlock";
}

export type TypeContentVideoBlockWithoutLinkResolutionResponse =
  TypeContentVideoBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentVideoBlockWithoutUnresolvableLinksResponse =
  TypeContentVideoBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentVideoBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentVideoBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeContentVideoBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentVideoBlock<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentVideoBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentVideoBlock<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
