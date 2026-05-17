"use client";

import clsx from "clsx";
import { Children, useId, useState } from "react";
import styles from "src/components/Carousel/Carousel.module.css";
import { Skeleton } from "src/components/Skeleton/Skeleton.component";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, type SwiperProps, SwiperSlide } from "swiper/react";

export interface CarouselProps {
  showSkeleton?: boolean;
  children: React.ReactNode;
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
  centeredSlides?: boolean;
  centeredSlidesBounds?: boolean;
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
    centeredSlides = false,
    centeredSlidesBounds = false,
    onSlideChange,
    onSwiper,
    animation = "slide",
    showSkeleton = false,
  } = props;

  const [isReady, setIsReady] = useState(!showSkeleton);

  const carouselId = useId();
  const navigationPrevId = `${carouselId}-nav-prev`;
  const navigationNextId = `${carouselId}-nav-next`;
  const paginationId = `${carouselId}-pagination`;

  const slides = Children.toArray(children);

  if (slides.length === 1) {
    return (
      <div
        className={clsx(
          styles.carousel,
          styles.controlsOverSlides,
          styles.singleSlide,
          className,
        )}
      >
        <div className={clsx(styles.slide, slideClassName)}>{slides[0]}</div>
      </div>
    );
  }

  const hasMultipleSlides = slides.length > 1;

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
      {showSkeleton && (
        <div
          aria-hidden
          className={styles.skeleton}
          data-ready={isReady}
          role="presentation"
        >
          <Skeleton className={styles.skeletonMedia} variant="media" />
        </div>
      )}
      <Swiper
        autoplay={
          autoplay
            ? {
                delay: autoplayDelay,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        breakpoints={breakpoints}
        centeredSlides={centeredSlides}
        centeredSlidesBounds={centeredSlidesBounds}
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
          requestAnimationFrame(() => {
            swiperInstance.update();
            if (showSkeleton) setIsReady(true);
          });
        }}
        pagination={paginationOptions}
        slidesPerView={animation === "fade" ? 1 : slidesPerView}
        spaceBetween={animation === "fade" ? 0 : spaceBetween}
      >
        {slides.map((child, position) => (
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
                  aria-label="Previous slide"
                  className={styles.navigationButton}
                  id={navigationPrevId}
                  type="button"
                >
                  <span aria-hidden className={styles.navigationIcon}>
                    ←
                  </span>
                </button>
                {showPagination && (
                  <div className={styles.pagination} id={paginationId} />
                )}
                <button
                  aria-label="Next slide"
                  className={styles.navigationButton}
                  id={navigationNextId}
                  type="button"
                >
                  <span aria-hidden className={styles.navigationIcon}>
                    →
                  </span>
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
