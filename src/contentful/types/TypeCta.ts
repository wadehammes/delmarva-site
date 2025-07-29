import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypePageSkeleton } from "./TypePage";

export interface TypeCtaFields {
  entryTitle?: EntryFieldTypes.Symbol;
  text: EntryFieldTypes.Symbol;
  pageLink?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  externalLink?: EntryFieldTypes.Symbol;
  buttonVariant?: EntryFieldTypes.Symbol<"Primary" | "Secondary">;
  arrow?: EntryFieldTypes.Symbol<"No Arrow" | "Right Arrow" | "Right-Up Arrow">;
}

export type TypeCtaSkeleton = EntrySkeletonType<TypeCtaFields, "cta">;
export type TypeCta<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCtaSkeleton, Modifiers, Locales>;
