"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ContentfulAssetRenderer } from "src/components/ContentfulAssetRenderer/ContentfulAssetRenderer.component";
import { ProjectModal } from "src/components/ProjectModal/ProjectModal.component";
import { ProjectStatsList } from "src/components/ProjectStatsList/ProjectStatsList.component";
import { RichText } from "src/components/RichText/RichText.component";
import { StaticMapImage } from "src/components/StaticMapImage/StaticMapImage.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useModal } from "src/hooks/useModal";
import { useProjectModal } from "src/hooks/useProjectModal";
import { usePathname, useRouter } from "src/i18n/routing";
import { isValidProjectLocation } from "src/utils/mapUtils";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectType;
  projectSlugFromServer?: string | null;
  selectedServiceSlug?: string;
  syncUrlOnOpen?: boolean;
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { project, projectSlugFromServer, selectedServiceSlug, syncUrlOnOpen } =
    props;
  const t = useTranslations("ProjectCard");
  const router = useRouter();
  const pathname = usePathname();

  const projectModal = useProjectModal({
    projectSlug: project.slug ?? "",
    projectSlugFromServer: projectSlugFromServer ?? null,
  });
  const localModal = useModal(false);
  const modal = syncUrlOnOpen ? projectModal : localModal;

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
    modal.open();
    if (syncUrlOnOpen && project.slug) {
      const params = new URLSearchParams(window.location.search);
      params.set("project", project.slug);
      router.replace(`${pathname}?${params}`, { scroll: false });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <>
      <button
        aria-label={t("viewDetails", { name: projectName ?? "" })}
        className={styles.projectCard}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {showMediaSection && (
          <div className={styles.projectCardMedia}>
            {showMap ? (
              <StaticMapImage location={projectLocation} />
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
      <ProjectModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        project={project}
      />
    </>
  );
};
