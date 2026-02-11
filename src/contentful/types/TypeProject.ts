import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeMarketSkeleton } from "./TypeMarket";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeProjectFields {
  entryTitle?: EntryFieldTypes.Symbol;
  projectName: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.RichText;
  media?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  projectStats?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContentStatBlockSkeleton>
  >;
  services: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
  markets?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeMarketSkeleton>
  >;
}

export type TypeProjectSkeleton = EntrySkeletonType<
  TypeProjectFields,
  "project"
>;
export type TypeProject<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeProjectSkeleton, Modifiers, Locales>;

export function isTypeProject<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeProject<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "project";
}

export type TypeProjectWithoutLinkResolutionResponse =
  TypeProject<"WITHOUT_LINK_RESOLUTION">;
export type TypeProjectWithoutUnresolvableLinksResponse =
  TypeProject<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeProjectWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeProject<"WITH_ALL_LOCALES", Locales>;
export type TypeProjectWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeProject<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeProjectWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeProject<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
