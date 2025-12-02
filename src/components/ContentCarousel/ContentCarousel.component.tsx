"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";
import { CarouselContentRenderer } from "src/components/CarouselContentRenderer/CarouselContentRenderer.component";
import type { ContentCarousel } from "src/contentful/parseContentCarousel";

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

  const { controlsPlacement } = carousel;

  return (
    <Carousel
      autoplay={autoplay}
      autoplayDelay={autoplayDelay}
      className={className}
      controlsPlacement={controlsPlacement}
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
