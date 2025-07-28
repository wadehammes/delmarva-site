"use client";

import dynamic from "next/dynamic";
import { CarouselContentRenderer } from "src/components/CarouselContentRenderer/CarouselContentRenderer.component";
import type { ContentCarousel } from "src/contentful/parseContentCarousel";

const Carousel = dynamic(
  () => import("../Carousel/Carousel.component").then((mod) => mod.Carousel),
  { ssr: false },
);

export interface ContentCarouselProps {
  carousel: ContentCarousel;
  className?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
}

/**
 * Contentful Carousel component that renders carousel items using ContentRenderer
 * Integrates with the existing Contentful content structure
 */
export const ContentCarouselComponent = (props: ContentCarouselProps) => {
  const {
    carousel,
    className,
    showNavigation = true,
    showPagination = true,
    autoplay = false,
    autoplayDelay = 5000,
    loop = true,
    slidesPerView = 1,
    spaceBetween = 30,
  } = props;

  if (!carousel?.carouselItems?.length) {
    return null;
  }

  return (
    <Carousel
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      className={className}
      loop={loop}
      showNavigation={showNavigation}
      showPagination={showPagination}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
    >
      {carousel.carouselItems.map((item) => {
        if (!item) {
          return null;
        }

        return <CarouselContentRenderer content={item} key={item.sys.id} />;
      })}
    </Carousel>
  );
};
