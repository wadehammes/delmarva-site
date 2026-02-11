import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentStatBlockFields {
  entryTitle: EntryFieldTypes.Symbol;
  statType: EntryFieldTypes.Symbol<"Currency" | "Numerical" | "Percentage">;
  stat: EntryFieldTypes.Number;
  statDescription: EntryFieldTypes.Symbol;
  decorator?: EntryFieldTypes.Symbol<"None" | "Plus Sign">;
  statServiceReference?: EntryFieldTypes.EntryLink<TypeServiceSkeleton>;
}

export type TypeContentStatBlockSkeleton = EntrySkeletonType<
  TypeContentStatBlockFields,
  "contentStatBlock"
>;
export type TypeContentStatBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentStatBlockSkeleton, Modifiers, Locales>;

export function isTypeContentStatBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(
  entry: Entry<EntrySkeletonType, Modifiers, Locales>,
): entry is TypeContentStatBlock<Modifiers, Locales> {
  return entry.sys.contentType.sys.id === "contentStatBlock";
}

export type TypeContentStatBlockWithoutLinkResolutionResponse =
  TypeContentStatBlock<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentStatBlockWithoutUnresolvableLinksResponse =
  TypeContentStatBlock<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentStatBlockWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentStatBlock<"WITH_ALL_LOCALES", Locales>;
export type TypeContentStatBlockWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentStatBlock<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentStatBlockWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentStatBlock<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
