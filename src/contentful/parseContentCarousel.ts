import type { Entry } from "contentful";
import type {
  ContentfulTypeCheck,
  ExtractSymbolType,
} from "src/contentful/helpers";
import type { ContentEntries } from "src/contentful/parseSections";
import type {
  TypeContentCarouselFields,
  TypeContentCarouselSkeleton,
} from "src/contentful/types/TypeContentCarousel";

type ControlsPlacementType = ExtractSymbolType<
  NonNullable<TypeContentCarouselFields["controlsPlacement"]>
>;

export interface ContentCarousel {
  carouselItems: (ContentEntries | null)[];
  controlsPlacement: ControlsPlacementType;
  id: string;
}

const _validateContentCarouselCheck: ContentfulTypeCheck<
  ContentCarousel,
  TypeContentCarouselFields,
  "id" | "controlsPlacement" | "carouselItems"
> = true;

export type ContentCarouselEntry =
  | Entry<TypeContentCarouselSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined;

export const parseContentCarousel = (
  contentCarousel: ContentCarouselEntry,
): ContentCarousel | null => {
  if (!contentCarousel) {
    return null;
  }

  if (!("fields" in contentCarousel)) {
    return null;
  }

  const { carouselItems } = contentCarousel.fields;

  return {
    carouselItems: carouselItems?.map((entry) => entry as ContentEntries) ?? [],
    controlsPlacement: (contentCarousel.fields.controlsPlacement ??
      "Over Slides") as ControlsPlacementType,
    id: contentCarousel.sys.id,
  };
};
