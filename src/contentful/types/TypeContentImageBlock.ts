import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeProjectSkeleton } from "./TypeProject";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentImageBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image: EntryFieldTypes.AssetLink;
  caption?: EntryFieldTypes.RichText;
  captionPlacement: EntryFieldTypes.Symbol<"Above" | "Below">;
  imageStyle: EntryFieldTypes.Symbol<
    "Black Background" | "Microdot Background" | "None"
  >;
  imageMaxWidth?: EntryFieldTypes.Integer;
  imageMaxWidthMobile?: EntryFieldTypes.Integer;
  services?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
  projects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeProjectSkeleton>
  >;
}

export type TypeContentImageBlockSkeleton = EntrySkeletonType<
  TypeContentImageBlockFields,
  "contentImageBlock"
>;
export type TypeContentImageBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentImageBlockSkeleton, Modifiers, Locales>;

export function isTypeContentImageBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentImageBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentImageBlock";
}

export type TypeContentImageBlockWithoutLinkResolutionResponse =
  TypeContentImageBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentImageBlockWithoutUnresolvableLinksResponse =
  TypeContentImageBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentImageBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentImageBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeContentImageBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentImageBlock<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentImageBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentImageBlock<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
