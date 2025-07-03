import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeContentGridSkeleton } from "./TypeContentGrid";
import type { TypeContentImageBlockSkeleton } from "./TypeContentImageBlock";
import type { TypeContentStatBlockSkeleton } from "./TypeContentStatBlock";
import type { TypeContentTestimonialSkeleton } from "./TypeContentTestimonial";
import type { TypeContentVideoBlockSkeleton } from "./TypeContentVideoBlock";

export interface TypeContentCarouselFields {
  entryTitle?: EntryFieldTypes.Symbol;
  slug?: EntryFieldTypes.Symbol;
  carouselItems?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContentGridSkeleton
      | TypeContentImageBlockSkeleton
      | TypeContentStatBlockSkeleton
      | TypeContentTestimonialSkeleton
      | TypeContentVideoBlockSkeleton
    >
  >;
}

export type TypeContentCarouselSkeleton = EntrySkeletonType<
  TypeContentCarouselFields,
  "contentCarousel"
>;
export type TypeContentCarousel<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCarouselSkeleton, Modifiers, Locales>;
