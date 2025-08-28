"use client";

import clsx from "clsx";
import { useId } from "react";
import styles from "src/components/Carousel/Carousel.module.css";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, type SwiperProps, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  breakpoints?: Record<number, Partial<SwiperProps>>;
  onSlideChange?: (swiper: SwiperType) => void;
  onSwiper?: (swiper: SwiperType) => void;
}

/**
 * Carousel component using Swiper library
 * Lightweight and flexible with hooks implementation
 */
export const Carousel = (props: CarouselProps) => {
  const {
    children,
    className,
    slideClassName,
    showNavigation = true,
    showPagination = true,
    autoplay = false,
    autoplayDelay = 3000,
    loop = false,
    slidesPerView = 1,
    spaceBetween = 30,
    breakpoints,
    onSlideChange,
    onSwiper,
  } = props;
  const carouselId = useId();
  const navigationPrevId = `${carouselId}-nav-prev`;
  const navigationNextId = `${carouselId}-nav-next`;
  const paginationId = `${carouselId}-pagination`;

  // If children is a single React element, just return it
  if (children.length === 1) {
    return <>{children[0]}</>;
  }

  const navigationOptions = showNavigation
    ? {
        nextEl: `#${navigationNextId}`,
        prevEl: `#${navigationPrevId}`,
      }
    : undefined;

  const paginationOptions = showPagination
    ? {
        clickable: true,
        el: `#${paginationId}`,
        type: "fraction" as const,
      }
    : undefined;

  return (
    <div className={clsx(styles.carousel, className)}>
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
        loop={loop}
        modules={[Autoplay, Navigation, Pagination]}
        navigation={navigationOptions}
        onSlideChange={onSlideChange}
        onSwiper={onSwiper}
        pagination={paginationOptions}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
      >
        {children.map((child, index) => (
          <SwiperSlide
            className={clsx(styles.slide, slideClassName)}
            key={index}
          >
            {child}
          </SwiperSlide>
        ))}

        {(showNavigation || showPagination) && (
          <div className={styles.navigationControls}>
            {showNavigation && (
              <>
                <button
                  className={styles.navigationButton}
                  id={navigationPrevId}
                  type="button"
                >
                  <span className={styles.navigationIcon}>‹</span>
                </button>
                {showPagination && (
                  <div className={styles.pagination} id={paginationId} />
                )}
                <button
                  className={styles.navigationButton}
                  id={navigationNextId}
                  type="button"
                >
                  <span className={styles.navigationIcon}>›</span>
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
