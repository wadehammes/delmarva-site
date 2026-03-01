"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef } from "react";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import type { ProjectType } from "src/contentful/getProjects";
import Chevron from "src/icons/Chevron.svg";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import styles from "./ProjectCoverflowCarousel.module.css";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ProjectCoverflowCarouselProps {
  carouselId?: string;
  onSwiper?: (swiper: SwiperType) => void;
  projects: ProjectType[];
  selectedServiceSlug?: string;
}

export const ProjectCoverflowCarousel = (
  props: ProjectCoverflowCarouselProps,
) => {
  const t = useTranslations("ProjectCoverflowCarousel");
  const {
    carouselId: propCarouselId,
    onSwiper,
    projects,
    selectedServiceSlug,
  } = props;

  const swiperRef = useRef<SwiperType | null>(null);
  const generatedCarouselId = useId();
  const carouselId = propCarouselId || generatedCarouselId;

  useEffect(() => {
    const handleResize = () => {
      if (swiperRef.current) {
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

  const elementIds = useMemo(
    () => ({
      navigationNext: `project-coverflow-carousel-${carouselId}-nav-next`,
      navigationPrev: `project-coverflow-carousel-${carouselId}-nav-prev`,
      pagination: `project-coverflow-carousel-${carouselId}-pagination`,
    }),
    [carouselId],
  );

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

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    if (onSwiper) {
      onSwiper(swiper);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className={styles.singleProject}>
        <p>No projects available</p>
      </div>
    );
  }

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
    <div className={styles.projectCoverflowCarousel}>
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
