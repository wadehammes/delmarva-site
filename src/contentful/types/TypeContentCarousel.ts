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
  controlsPlacement?: EntryFieldTypes.Symbol<"Below Slides" | "Over Slides">;
}

export type TypeContentCarouselSkeleton = EntrySkeletonType<
  TypeContentCarouselFields,
  "contentCarousel"
>;
export type TypeContentCarousel<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeContentCarouselSkeleton, Modifiers, Locales>;

export function isTypeContentCarousel<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode,
>(entry: unknown): entry is TypeContentCarousel<Modifiers, Locales> {
  const candidate = entry as {
    sys?: { contentType?: { sys?: { id?: string } } };
  };
  return candidate.sys?.contentType?.sys?.id === "contentCarousel";
}

export type TypeContentCarouselWithoutLinkResolutionResponse =
  TypeContentCarousel<"WITHOUT_LINK_RESOLUTION">;
export type TypeContentCarouselWithoutUnresolvableLinksResponse =
  TypeContentCarousel<"WITHOUT_UNRESOLVABLE_LINKS">;
export type TypeContentCarouselWithAllLocalesResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCarousel<"WITH_ALL_LOCALES", Locales>;
export type TypeContentCarouselWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCarousel<
  "WITHOUT_LINK_RESOLUTION" | "WITH_ALL_LOCALES",
  Locales
>;
export type TypeContentCarouselWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode,
> = TypeContentCarousel<
  "WITHOUT_UNRESOLVABLE_LINKS" | "WITH_ALL_LOCALES",
  Locales
>;
