import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeNavigationFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton>>;
  ctaButton?: EntryFieldTypes.EntryLink<TypeCtaSkeleton>;
}

export type TypeNavigationSkeleton = EntrySkeletonType<
  TypeNavigationFields,
  "navigation"
>;
export type TypeNavigation<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;
