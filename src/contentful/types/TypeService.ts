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
