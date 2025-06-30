import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeProjectFields {
  entryTitle?: EntryFieldTypes.Symbol;
  projectName: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  projectDescription: EntryFieldTypes.Text;
  projectMedia: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContentImageBlockSkeleton | TypeContentVideoBlockSkeleton
    >
  >;
  projectStats?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContentStatBlockSkeleton>
  >;
  services: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
}

export type TypeProjectSkeleton = EntrySkeletonType<
  TypeProjectFields,
  "project"
>;
export type TypeProject<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeProjectSkeleton, Modifiers, Locales>;
