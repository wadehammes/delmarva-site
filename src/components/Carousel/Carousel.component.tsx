"use client";

import clsx from "clsx";
import { useId } from "react";
import styles from "src/components/Carousel/Carousel.module.css";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, type SwiperProps, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  controlsPlacement?: "Over Slides" | "Below Slides";
  controlsSize?: "Small" | "Regular";
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  breakpoints?: Record<number, Partial<SwiperProps>>;
  onSlideChange?: (swiper: SwiperType) => void;
  onSwiper?: (swiper: SwiperType) => void;
  animation?: "slide" | "fade";
}

/**
 * Simple, clean carousel component using Swiper library
 */
export const Carousel = (props: CarouselProps) => {
  const {
    children,
    className,
    slideClassName,
    showNavigation = true,
    showPagination = true,
    controlsPlacement = "Over Slides",
    controlsSize = "Regular",
    autoplay = false,
    autoplayDelay = 3000,
    loop = false,
    slidesPerView = 1,
    spaceBetween = 30,
    breakpoints,
    onSlideChange,
    onSwiper,
    animation = "slide",
  } = props;

  const carouselId = useId();
  const navigationPrevId = `${carouselId}-nav-prev`;
  const navigationNextId = `${carouselId}-nav-next`;
  const paginationId = `${carouselId}-pagination`;

  // If children is a single React element, just return it without carousel wrapper
  if (children.length === 1) {
    return <>{children[0]}</>;
  }

  // Only show navigation and pagination if there are multiple slides
  const hasMultipleSlides = children.length > 1;

  const navigationOptions =
    showNavigation && hasMultipleSlides
      ? {
          nextEl: `#${navigationNextId}`,
          prevEl: `#${navigationPrevId}`,
        }
      : undefined;

  const paginationOptions =
    showPagination && hasMultipleSlides
      ? {
          clickable: true,
          el: `#${paginationId}`,
          type: "fraction" as const,
        }
      : undefined;

  return (
    <div
      className={clsx(
        styles.carousel,
        {
          [styles.controlsOverSlides]: controlsPlacement === "Over Slides",
        },
        className,
      )}
    >
      <Swiper
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
              }
            : false
        }
        breakpoints={breakpoints}
        className={styles.swiper}
        effect={animation === "fade" ? "fade" : undefined}
        loop={loop}
        modules={[
          Autoplay,
          Navigation,
          Pagination,
          ...(animation === "fade" ? [EffectFade] : []),
        ]}
        navigation={navigationOptions}
        observeParents
        observer
        observeSlideChildren
        onSlideChange={onSlideChange}
        onSwiper={(swiperInstance) => {
          onSwiper?.(swiperInstance);
          // Ensure measurements are correct after layout settles
          requestAnimationFrame(() => swiperInstance.update());
        }}
        pagination={paginationOptions}
        slidesPerView={animation === "fade" ? 1 : slidesPerView}
        spaceBetween={animation === "fade" ? 0 : spaceBetween}
      >
        {children.map((child, position) => (
          <SwiperSlide
            className={clsx(styles.slide, slideClassName)}
            key={`slide-${position}`}
          >
            {child}
          </SwiperSlide>
        ))}

        {(showNavigation || showPagination) && hasMultipleSlides && (
          <div
            className={clsx(styles.navigationControls, {
              [styles.controlsBelowSlides]:
                controlsPlacement === "Below Slides",
              [styles.controlsSmall]: controlsSize === "Small",
            })}
          >
            {showNavigation && (
              <>
                <button
                  className={styles.navigationButton}
                  id={navigationPrevId}
                  type="button"
                >
                  <span className={styles.navigationIcon}>←</span>
                </button>
                {showPagination && (
                  <div className={styles.pagination} id={paginationId} />
                )}
                <button
                  className={styles.navigationButton}
                  id={navigationNextId}
                  type="button"
                >
                  <span className={styles.navigationIcon}>→</span>
                </button>
              </>
            )}
            {!showNavigation && showPagination && (
              <div className={styles.pagination} id={paginationId} />
            )}
          </div>
        )}
      </Swiper>
    </div>
  );
};
