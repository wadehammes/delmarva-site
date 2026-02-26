"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef } from "react";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import type { ProjectType } from "src/contentful/getProjects";
import Chevron from "src/icons/Chevron.svg";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import styles from "./ProjectCarousel.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProjectCarouselProps {
  projects: ProjectType[];
  selectedServiceSlug?: string;
  carouselId?: string;
  onSwiper?: (swiper: SwiperType) => void;
}

export const ProjectCarousel = (props: ProjectCarouselProps) => {
  const t = useTranslations("ProjectCarousel");
  const {
    projects,
    selectedServiceSlug,
    carouselId: propCarouselId,
    onSwiper,
  } = props;

  const swiperRef = useRef<SwiperType | null>(null);
  const generatedCarouselId = useId();
  const carouselId = propCarouselId || generatedCarouselId;

  // Handle Swiper resize and recalculation
  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
        // Force Swiper to recalculate its layout
        swiperRef.current.update();
        swiperRef.current.updateSize();
        swiperRef.current.updateSlides();
        swiperRef.current.updateProgress();
        swiperRef.current.updateSlidesClasses();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize IDs to prevent unnecessary re-renders
  const elementIds = useMemo(
    () => ({
      navigationNext: `project-carousel-${carouselId}-nav-next`,
      navigationPrev: `project-carousel-${carouselId}-nav-prev`,
      pagination: `project-carousel-${carouselId}-pagination`,
    }),
    [carouselId],
  );

  // Memoize Swiper configuration for better performance
  const swiperConfig = useMemo(
    () => ({
      breakpoints: {
        768: { slidesPerView: "auto" as const, spaceBetween: 48 },
      },
      centeredSlides: true,
      coverflowEffect: {
        depth: 0,
        modifier: 1,
        rotate: 0,
        slideShadows: false,
        stretch: 0,
      },
      effect: "coverflow" as const,
      grabCursor: true,
      modules: [EffectCoverflow, Navigation, Pagination],
      navigation: {
        nextEl: `#${elementIds.navigationNext}`,
        prevEl: `#${elementIds.navigationPrev}`,
      },
      observeParents: true,
      observer: true,
      pagination: {
        clickable: true,
        el: `#${elementIds.pagination}`,
        type: "bullets" as const,
      },
      preventInteractionOnTransition: true,
      resizeObserver: true,
      slidesPerView: 1,
      spaceBetween: 16,
      watchOverflow: true,
      watchSlidesProgress: true,
    }),
    [elementIds],
  );

  // Handle Swiper initialization
  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    if (onSwiper) {
      onSwiper(swiper);
    }
  };

  // Handle empty or invalid projects array
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.singleProject}>
        <p>No projects available</p>
      </div>
    );
  }

  // If there's only one project, just render it normally
  if (projects.length === 1) {
    return (
      <div className={styles.singleProject}>
        <ProjectCard
          project={projects[0]}
          selectedServiceSlug={selectedServiceSlug}
        />
      </div>
    );
  }

  return (
    <div className={styles.projectCarousel}>
      <Swiper
        {...swiperConfig}
        className={styles.swiper}
        onSwiper={handleSwiperInit}
      >
        {projects.map((project) => (
          <SwiperSlide className={styles.slide} key={project.id}>
            <ProjectCard
              project={project}
              selectedServiceSlug={selectedServiceSlug}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.navigationControls}>
        <button
          aria-label={t("previousProject")}
          className={styles.navigationButton}
          id={elementIds.navigationPrev}
          type="button"
        >
          <Chevron className={styles.navigationIconLeft} />
        </button>
        <div className={styles.pagination} id={elementIds.pagination} />
        <button
          aria-label={t("nextProject")}
          className={styles.navigationButton}
          id={elementIds.navigationNext}
          type="button"
        >
          <Chevron className={styles.navigationIconRight} />
        </button>
      </div>
    </div>
  );
};
