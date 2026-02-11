import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentCardSkeleton } from "./TypeContentCard";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";

export interface TypeContentMarqueeFields {
  entryTitle?: EntryFieldTypes.Symbol;
  items?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContentCardSkeleton | TypeContentStatBlockSkeleton
    >
  >;
}

export type TypeContentMarqueeSkeleton = EntrySkeletonType<
  TypeContentMarqueeFields,
  "contentMarquee"
>;
export type TypeContentMarquee<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentMarqueeSkeleton, Modifiers, Locales>;

export function isTypeContentMarquee<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentMarquee<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentMarquee";
}

export type TypeContentMarqueeWithoutLinkResolutionResponse =
  TypeContentMarquee<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentMarqueeWithoutUnresolvableLinksResponse =
  TypeContentMarquee<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentMarqueeWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentMarquee<"WITH_ALL_LOCALES", Locales>;
export type TypeContentMarqueeWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentMarquee<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContentMarqueeWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentMarquee<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
