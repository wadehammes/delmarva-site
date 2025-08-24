import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeProjectSkeleton } from "./TypeProject";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentVideoBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  videoUrl: EntryFieldTypes.Symbol;
  videoUpload?: EntryFieldTypes.AssetLink;
  services?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
  projects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeProjectSkeleton>
  >;
}

export type TypeContentVideoBlockSkeleton = EntrySkeletonType<
  TypeContentVideoBlockFields,
  "contentVideoBlock"
>;
export type TypeContentVideoBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentVideoBlockSkeleton, Modifiers, Locales>;
