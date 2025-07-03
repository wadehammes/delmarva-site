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
    | "Featured Services List"
    | "Join Our Team Form"
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
