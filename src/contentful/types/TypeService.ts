import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeSectionSkeleton } from "./TypeSection";

export interface TypeServiceFields {
  entryTitle?: EntryFieldTypes.Symbol;
  serviceName: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.RichText;
  stats?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContentStatBlockSkeleton>
  >;
  featuredStat?: EntryFieldTypes.EntryLink<TypeContentStatBlockSkeleton>;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSectionSkeleton>
  >;
  serviceCountiesCsv?: EntryFieldTypes.AssetLink;
  serviceCountiesMapColor?: EntryFieldTypes.Symbol<
    "Blue" | "Green" | "Orange" | "Pink" | "Purple" | "Red" | "White" | "Yellow"
  >;
  featuredService?: EntryFieldTypes.Boolean;
  featuredServicePosition?: EntryFieldTypes.Integer;
  metaTitle: EntryFieldTypes.Symbol;
  metaDescription: EntryFieldTypes.Symbol;
  metaImage: EntryFieldTypes.AssetLink;
  enableIndexing: EntryFieldTypes.Boolean;
}

export type TypeServiceSkeleton = EntrySkeletonType<
  TypeServiceFields,
  "service"
>;
export type TypeService<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeServiceSkeleton, Modifiers, Locales>;

export function isTypeService<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeService<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "service";
}

export type TypeServiceWithoutLinkResolutionResponse =
  TypeService<"WITHOUT_LINK_RESOLUTION">;
export type TypeServiceWithoutUnresolvableLinksResponse =
  TypeService<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeServiceWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeService<"WITH_ALL_LOCALES", Locales>;
export type TypeServiceWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeService<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeServiceWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeService<"WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES", Locales>;
