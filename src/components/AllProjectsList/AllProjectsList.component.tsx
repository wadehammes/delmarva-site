"use client";

import { useCallback, useState } from "react";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import { SkeletonCardTrack } from "src/components/Skeleton/Skeleton.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { Swiper as SwiperType } from "swiper";
import styles from "./AllProjectsList.module.css";

interface AllProjectsListProps {
  projectSlug?: string | null;
  projects: ProjectType[];
}

export const AllProjectsList = ({
  projectSlug: projectSlugFromServer = null,
  projects,
}: AllProjectsListProps) => {
  const [isReady, setIsReady] = useState(projects.length === 1);

  const handleSwiperReady = useCallback((swiper: SwiperType) => {
    requestAnimationFrame(() => {
      swiper.update();
      requestAnimationFrame(() => setIsReady(true));
    });
  }, []);

  if (projects.length === 0) {
    return null;
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
          0: { slidesPerView: 1, spaceBetween: 4 },
          600: { slidesPerView: 2.2, spaceBetween: 4 },
          900: { slidesPerView: 3.2, spaceBetween: 4 },
          1200: { slidesPerView: 4.2, spaceBetween: 4 },
          1500: { slidesPerView: 5.2, spaceBetween: 4 },
        }}
        centeredSlides
        className={styles.carousel}
        controlsPlacement="Below Slides"
        loop
        onSwiper={handleSwiperReady}
        showNavigation
        showPagination
        slideClassName={styles.slide}
        spaceBetween={24}
      >
        {projects.map((project) => (
          <div className={styles.slideInner} key={project.id}>
            <ProjectCard
              project={project}
              projectSlugFromServer={projectSlugFromServer}
              syncUrlOnOpen
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
