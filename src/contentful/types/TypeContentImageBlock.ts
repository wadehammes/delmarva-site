import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeProjectSkeleton } from "./TypeProject";
import type { TypeServiceSkeleton } from "./TypeService";

export interface TypeContentImageBlockFields {
  entryTitle?: EntryFieldTypes.Symbol;
  image: EntryFieldTypes.AssetLink;
  caption?: EntryFieldTypes.RichText;
  captionPlacement: EntryFieldTypes.Symbol<"Above" | "Below">;
  imageStyle: EntryFieldTypes.Symbol<
    "Black Background" | "Microdot Background" | "None"
  >;
  services?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceSkeleton>
  >;
  projects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeProjectSkeleton>
  >;
}

export type TypeContentImageBlockSkeleton = EntrySkeletonType<
  TypeContentImageBlockFields,
  "contentImageBlock"
>;
export type TypeContentImageBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentImageBlockSkeleton, Modifiers, Locales>;
