"use client";

import { Button as UIButton } from "@base-ui/react/button";
import { useLocale, useTranslations } from "next-intl";
import { type ReactElement, useCallback, useState } from "react";
import buttonStyles from "src/components/Button/Button.module.css";
import { Carousel } from "src/components/Carousel/Carousel.component";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { Modal } from "src/components/Modal/Modal.component";
import { ProjectStaticMap } from "src/components/ProjectStaticMap/ProjectStaticMap.component";
import { ProjectStatsList } from "src/components/ProjectStatsList/ProjectStatsList.component";
import { RichText } from "src/components/RichText/RichText.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { FALLBACK_PROJECT_MEDIA_ID } from "src/contentful/constants";
import type { ProjectType } from "src/contentful/getProjects";
import ShareIcon from "src/icons/Share.svg";
import { trackEvent } from "src/lib/trackEvent";
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
  const t = useTranslations("ProjectModal");
  const locale = useLocale();
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  const handleShare = useCallback(() => {
    if (!project?.slug) return;

    trackEvent("project-modal-share");

    const path =
      locale === "en"
        ? `/${SERVICES_PAGE_SLUG}`
        : `/${locale}/${SERVICES_PAGE_SLUG}`;
    const url = `${window.location.origin}${path}?project=${project.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    });
  }, [locale, project?.slug]);

  if (!project) {
    return null;
  }

  const {
    projectName,
    description,
    media,
    markets,
    projectLocation,
    projectStats,
    services,
    youTubeVideoUrl,
  } = project;

  const allMedia = media ?? [];
  const allMarkets =
    markets?.filter((m): m is NonNullable<typeof m> => m != null) ?? [];
  const showMap = isValidProjectLocation(projectLocation) && projectLocation;
  const isOnlyFallbackMedia =
    allMedia.length === 1 && allMedia[0]?.id === FALLBACK_PROJECT_MEDIA_ID;
  const mediaToShow = isOnlyFallbackMedia && showMap ? [] : allMedia;
  const youTubeUrl = youTubeVideoUrl?.trim();

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
    ...(youTubeUrl
      ? [
          <VideoPlayer
            controls={true}
            key="project-youtube-video"
            src={youTubeUrl}
            title={projectName}
          />,
        ]
      : []),
    ...mediaToShow.map((item) =>
      item?.src?.trim() ? (
        <ContentfulAssetRenderer asset={item} key={item.id} />
      ) : null,
    ),
  ].filter((slide): slide is ReactElement => slide != null);

  return (
    <Modal
      closeOnClickOutside={true}
      closeOnEscape={true}
      isOpen={isOpen}
      onClose={onClose}
      size="small"
    >
      <Modal.Header>
        <h2 className={styles.projectTitle}>{projectName}</h2>
        {services.length > 0 ? (
          <div className={styles.servicesList}>
            {services.map((service) => {
              if (!service) {
                return null;
              }

              return (
                <span className={styles.serviceTag} key={service.id}>
                  {service.serviceName}
                </span>
              );
            })}
          </div>
        ) : null}
      </Modal.Header>

      <Modal.Body>
        <div className={styles.mediaSection}>
          {carouselSlides.length > 0 ? (
            <Carousel
              animation="fade"
              controlsSize="Small"
              spaceBetween={0}
              trackingLabel={`project-modal-${project.slug}`}
            >
              {carouselSlides}
            </Carousel>
          ) : null}
        </div>

        <div className={styles.contentSection}>
          <div className={styles.descriptionSection}>
            <RichText document={description} />
          </div>

          {(projectStats?.length ?? 0) > 0 || allMarkets.length > 0 ? (
            <div className={styles.statsSection}>
              <ProjectStatsList
                markets={allMarkets}
                marketsLabel={t("markets")}
                stats={projectStats ?? []}
              />
            </div>
          ) : null}

          <div className={styles.shareSection}>
            <UIButton
              className={`${buttonStyles.button} ${buttonStyles.outline} ${styles.shareButton}`}
              onClick={handleShare}
              type="button"
            >
              <ShareIcon />
              {copyStatus === "copied" ? t("shareCopied") : t("shareProject")}
            </UIButton>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
