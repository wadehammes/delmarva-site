"use client";

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
  project: ProjectType;
  selectedServiceSlug?: string;
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { project, selectedServiceSlug } = props;
  const { isOpen, open, close } = useModal();

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
        aria-label={`View details for ${projectName}`}
        className={styles.projectCard}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
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
      <ProjectModal isOpen={isOpen} onClose={close} project={project} />
    </>
  );
};
