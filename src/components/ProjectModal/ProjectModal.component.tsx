"use client";

import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { Modal } from "src/components/Modal/Modal.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ProjectType } from "src/contentful/getProjects";
import { Link } from "src/i18n/routing";
import { SERVICES_PAGE_SLUG } from "src/utils/constants";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ProjectModal.module.css";

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

  const { projectName, description, media, projectStats, services } = project;

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
          {media && media.length > 0 && (
            <Carousel animation="fade" controlsSize="Small" spaceBetween={0}>
              {media.map((media) => {
                if (!media) {
                  return null;
                }

                return <ContentfulAssetRenderer asset={media} key={media.id} />;
              })}
            </Carousel>
          )}
        </div>

        <div className={styles.contentSection}>
          <div className={styles.descriptionSection}>
            <RichText document={description} />
          </div>

          {projectStats && projectStats.length > 0 && (
            <div className={styles.statsSection}>
              <dl className={styles.statsList}>
                {projectStats.map((stat) => {
                  if (!stat) {
                    return null;
                  }

                  return (
                    <div className={styles.stat} key={stat.id}>
                      <dt className={styles.statDescription}>
                        {stat.description}
                      </dt>
                      <dd className={styles.statValue}>
                        {formatNumber({
                          decorator: stat.decorator,
                          keepInitialValue: true,
                          num: stat?.value ?? 0,
                          type: stat?.type,
                        })}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
