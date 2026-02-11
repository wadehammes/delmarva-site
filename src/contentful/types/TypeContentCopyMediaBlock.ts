import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeCopyBlockSkeleton } from "./TypeCopyBlock";

export interface TypeContentCopyMediaBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  copy?: EntryFieldTypes.EntryLink<TypeCopyBlockSkeleton>;
  media?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContentImageBlockSkeleton | TypeContentVideoBlockSkeleton
    >
  >;
  mediaPlacement?: EntryFieldTypes.Symbol<"Left" | "Right">;
  mediaBackgroundStyle?: EntryFieldTypes.Symbol<
    "Black Background" | "Microdot Background" | "None"
  >;
}

export type TypeContentCopyMediaBlockSkeleton = EntrySkeletonType<
  TypeContentCopyMediaBlockFields,
  "contentCopyMediaBlock"
>;
export type TypeContentCopyMediaBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCopyMediaBlockSkeleton, Modifiers, Locales>;

export function isTypeContentCopyMediaBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentCopyMediaBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentCopyMediaBlock";
}

export type TypeContentCopyMediaBlockWithoutLinkResolutionResponse =
  TypeContentCopyMediaBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentCopyMediaBlockWithoutUnresolvableLinksResponse =
  TypeContentCopyMediaBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentCopyMediaBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCopyMediaBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeContentCopyMediaBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCopyMediaBlock<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentCopyMediaBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCopyMediaBlock<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
