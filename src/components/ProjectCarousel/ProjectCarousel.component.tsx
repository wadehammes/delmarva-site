"use client";

import { useId } from "react";
import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import type { ProjectType } from "src/contentful/getProjects";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./ProjectCarousel.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import SVG icon
import Chevron from "src/icons/Chevron.svg";

interface ProjectCarouselProps {
  projects: ProjectType[];
  selectedServiceSlug?: string;
}

export const ProjectCarousel = (props: ProjectCarouselProps) => {
  const { projects, selectedServiceSlug } = props;
  const carouselId = useId();
  const navigationPrevId = `${carouselId}-nav-prev`;
  const navigationNextId = `${carouselId}-nav-next`;
  const paginationId = `${carouselId}-pagination`;

  // If there's only one project, just render it normally
  if (projects.length <= 1) {
    return (
      <div className={styles.singleProject}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            selectedServiceSlug={selectedServiceSlug}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.projectCarousel}>
      <Swiper
        centeredSlides={true}
        className={styles.swiper}
        coverflowEffect={{
          depth: 100,
          modifier: 1,
          rotate: 0,
          slideShadows: false,
          stretch: 0,
        }}
        effect="coverflow"
        grabCursor={true}
        modules={[EffectCoverflow, Navigation, Pagination]}
        navigation={{
          nextEl: `#${navigationNextId}`,
          prevEl: `#${navigationPrevId}`,
        }}
        pagination={{
          clickable: true,
          el: `#${paginationId}`,
          type: "bullets",
        }}
        slidesPerView="auto"
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
          className={styles.navigationButton}
          id={navigationPrevId}
          type="button"
        >
          <Chevron className={styles.navigationIconLeft} />
        </button>
        <div className={styles.pagination} id={paginationId} />
        <button
          className={styles.navigationButton}
          id={navigationNextId}
          type="button"
        >
          <Chevron className={styles.navigationIconRight} />
        </button>
      </div>
    </div>
  );
};
