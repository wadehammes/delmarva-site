"use client";

import { useCallback, useState } from "react";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import { SkeletonCardTrack } from "src/components/Skeleton/Skeleton.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { Swiper as SwiperType } from "swiper";
import styles from "./ProjectsCarousel.module.css";

interface ProjectsCarouselProps {
  projectSlugFromServer?: string | null;
  projects: ProjectType[];
  selectedServiceSlug?: string;
  syncUrlOnOpen?: boolean;
}

const CAROUSEL_MIN_PROJECTS = 6;

export const ProjectsCarousel = ({
  projectSlugFromServer = null,
  projects,
  selectedServiceSlug,
  syncUrlOnOpen = false,
}: ProjectsCarouselProps) => {
  const useCarousel = projects.length >= CAROUSEL_MIN_PROJECTS;
  const [isReady, setIsReady] = useState(!useCarousel);

  const handleSwiperReady = useCallback((swiper: SwiperType) => {
    requestAnimationFrame(() => {
      swiper.update();
      requestAnimationFrame(() => setIsReady(true));
    });
  }, []);

  if (projects.length === 0) {
    return null;
  }

  if (!useCarousel) {
    return (
      <div className={styles.grid}>
        {projects.map((project) => (
          <div className={styles.gridItem} key={project.id}>
            <ProjectCard
              project={project}
              projectSlugFromServer={projectSlugFromServer}
              selectedServiceSlug={selectedServiceSlug}
              syncUrlOnOpen={syncUrlOnOpen}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div
        aria-hidden
        className={styles.skeleton}
        data-ready={isReady}
        role="presentation"
      >
        <SkeletonCardTrack cardCount={5} variant="projects" />
      </div>
      <Carousel
        autoplay
        autoplayDelay={5000}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          600: { slidesPerView: 2, spaceBetween: 12 },
          900: { slidesPerView: 3, spaceBetween: 12 },
          1200: { slidesPerView: 4, spaceBetween: 12 },
          1500: { slidesPerView: 5, spaceBetween: 12 },
        }}
        className={styles.carousel}
        controlsPlacement="Below Slides"
        loop
        onSwiper={handleSwiperReady}
        showNavigation
        showPagination
        slideClassName={styles.slide}
        spaceBetween={12}
      >
        {projects.map((project) => (
          <div className={styles.slideInner} key={project.id}>
            <ProjectCard
              project={project}
              projectSlugFromServer={projectSlugFromServer}
              selectedServiceSlug={selectedServiceSlug}
              syncUrlOnOpen={syncUrlOnOpen}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
