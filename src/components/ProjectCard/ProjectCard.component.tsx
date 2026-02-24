"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { ProjectModal } from "src/components/ProjectModal/ProjectModal.component";
import { ProjectStaticMap } from "src/components/ProjectStaticMap/ProjectStaticMap.component";
import { ProjectStatsList } from "src/components/ProjectStatsList/ProjectStatsList.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useModal } from "src/hooks/useModal";
import { isValidProjectLocation } from "src/utils/mapUtils";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  openOnMount?: boolean;
  project: ProjectType;
  selectedServiceSlug?: string;
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { openOnMount, project, selectedServiceSlug } = props;
  const t = useTranslations("ProjectCard");
  const { isOpen, open, close } = useModal();
  const pathname = usePathname();
  const router = useRouter();

  const handleClose = () => {
    close();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("project")) {
        params.delete("project");
        router.replace(params.toString() ? `${pathname}?${params}` : pathname);
      }
    }
  };

  const handleMountRef = (el: HTMLButtonElement | null) => {
    if (el && openOnMount) open();
  };

  const { projectName, description, media, projectLocation, projectStats } =
    project;

  const showMap = isValidProjectLocation(projectLocation) && projectLocation;
  const showMediaSection = showMap || media?.[0];

  const projectStatsByService: (ContentStatBlock | null)[] | null =
    useMemo(() => {
      if (!projectStats) {
        return null;
      }

      if (!selectedServiceSlug) {
        return projectStats;
      }

      return projectStats?.filter((stat) => {
        if (!stat?.statServiceReference) {
          return true;
        }

        return stat?.statServiceReference === selectedServiceSlug;
      });
    }, [projectStats, selectedServiceSlug]);

  const handleCardClick = () => {
    open();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  return (
    <>
      <button
        aria-label={t("viewDetails", { name: projectName ?? "" })}
        className={styles.projectCard}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        ref={handleMountRef}
        type="button"
      >
        {showMediaSection && (
          <div className={styles.projectCardMedia}>
            {showMap ? (
              <ProjectStaticMap projectLocation={projectLocation} />
            ) : media?.[0] ? (
              <ContentfulAssetRenderer
                asset={media[0]}
                height={202}
                width={360}
              />
            ) : null}
          </div>
        )}
        <div className={styles.projectCardContent}>
          <header className={styles.projectCardHeader}>
            <h3>{projectName}</h3>
            <RichText document={description} />
          </header>
          <div className={styles.statsList}>
            <ProjectStatsList stats={projectStatsByService ?? []} />
          </div>
        </div>
      </button>
      <ProjectModal isOpen={isOpen} onClose={handleClose} project={project} />
    </>
  );
};
