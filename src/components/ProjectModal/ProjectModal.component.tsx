"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { Modal } from "src/components/Modal/Modal.component";
import { ProjectStaticMap } from "src/components/ProjectStaticMap/ProjectStaticMap.component";
import { ProjectStatsList } from "src/components/ProjectStatsList/ProjectStatsList.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ProjectType } from "src/contentful/getProjects";
import { Link } from "src/i18n/routing";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { isValidProjectLocation } from "src/utils/mapUtils";
import styles from "./ProjectModal.module.css";

const MODAL_MAP_WIDTH = 640;
const MODAL_MAP_HEIGHT = 360;

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectType | null;
}

export const ProjectModal = ({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) => {
  if (!project) {
    return null;
  }

  const {
    projectName,
    description,
    media,
    projectLocation,
    projectStats,
    services,
  } = project;

  const allMedia = media ?? [];
  const showMap = isValidProjectLocation(projectLocation) && projectLocation;
  const showCarousel = allMedia.length > 0 || !!showMap;

  const carouselSlides = [
    ...(showMap
      ? [
          <ProjectStaticMap
            height={MODAL_MAP_HEIGHT}
            key="project-map"
            projectLocation={showMap}
            width={MODAL_MAP_WIDTH}
          />,
        ]
      : []),
    ...allMedia.map((item) =>
      item ? <ContentfulAssetRenderer asset={item} key={item.id} /> : null,
    ),
  ].filter(Boolean);

  return (
    <Modal
      closeOnClickOutside={true}
      closeOnEscape={true}
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      size="small"
    >
      <Modal.Header onClose={onClose}>
        <h2 className={styles.projectTitle}>{projectName}</h2>
        {services.length > 0 && (
          <div className={styles.servicesList}>
            {services.map((service) => {
              if (!service) {
                return null;
              }

              return (
                <Link
                  href={`/${SERVICES_PAGE_SLUG}/${service.slug}`}
                  key={service.id}
                >
                  <span className={styles.serviceTag} key={service.id}>
                    {service.serviceName}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Modal.Header>

      <Modal.Body>
        <div className={styles.mediaSection}>
          {showCarousel && (
            <Carousel animation="fade" controlsSize="Small" spaceBetween={0}>
              {carouselSlides}
            </Carousel>
          )}
        </div>

        <div className={styles.contentSection}>
          <div className={styles.descriptionSection}>
            <RichText document={description} />
          </div>

          {projectStats && projectStats.length > 0 && (
            <div className={styles.statsSection}>
              <ProjectStatsList stats={projectStats} />
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
