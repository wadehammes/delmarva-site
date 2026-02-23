import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeContentModulesFields {
  entryTitle?: EntryFieldTypes.Symbol;
  module: EntryFieldTypes.Symbol<
    | "All Projects"
    | "All Services List"
    | "Areas Serviced List"
    | "Areas Serviced Map"
    | "Featured Services List"
    | "Recent News List"
    | "Request a Quote Form"
  >;
}

export type TypeContentModulesSkeleton = EntrySkeletonType<
  TypeContentModulesFields,
  "contentModules"
>;
export type TypeContentModules<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentModulesSkeleton, Modifiers, Locales>;

export function isTypeContentModules<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentModules<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentModules";
}

export type TypeContentModulesWithoutLinkResolutionResponse =
  TypeContentModules<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentModulesWithoutUnresolvableLinksResponse =
  TypeContentModules<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentModulesWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentModules<"WITH_ALL_LOCALES", Locales>;
export type TypeContentModulesWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentModules<"WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES", Locales>;
export type TypeContentModulesWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentModules<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
