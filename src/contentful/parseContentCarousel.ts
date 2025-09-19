import type { Entry } from "contentful";
import type { ContentEntries } from "src/contentful/parseSections";
import type { TypeContentCarouselSkeleton } from "src/contentful/types/TypeContentCarousel";

export interface ContentCarousel {
  carouselItems: (ContentEntries | null)[];
  controlsPlacement: "Over Slides" | "Below Slides";
  id: string;
}

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
    controlsPlacement:
      contentCarousel.fields.controlsPlacement ?? "Over Slides",
    id: contentCarousel.sys.id,
  };
};
