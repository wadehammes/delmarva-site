import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeCtaSkeleton } from "./TypeCta";

export interface TypeFooterFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug?: EntryFieldTypes.Symbol;
  copyright?: EntryFieldTypes.Symbol;
  addresscompanyInfo?: EntryFieldTypes.RichText;
  links?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCtaSkeleton>>;
  linksTitle?: EntryFieldTypes.Symbol;
  otherLinks?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeCtaSkeleton>
  >;
  otherLinksTitle?: EntryFieldTypes.Symbol;
  linkedInUrl?: EntryFieldTypes.Symbol;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFooterSkeleton, Modifiers, Locales>;
