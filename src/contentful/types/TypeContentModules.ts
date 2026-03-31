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
    | "All Markets List"
    | "All Projects"
    | "All Services List"
    | "Areas Serviced List"
    | "Areas Serviced Map - Turnkey Only"
    | "Areas Serviced Map"
    | "Featured Services List"
    | "Recent News List"
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
>(entry: unknown): entry is TypeContentModules<Modifiers, Locales> {
  const candidate = entry as {
    sys?: { contentType?: { sys?: { id?: string } } };
  };
  return candidate.sys?.contentType?.sys?.id === "contentModules";
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
