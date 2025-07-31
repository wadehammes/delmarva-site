import { useMemo } from "react";
import { MediaRenderer } from "src/components/MediaRenderer/MediaRenderer.component";
import { ProjectModal } from "src/components/ProjectModal/ProjectModal.component";
import { RichText } from "src/components/RichText/RichText.component";
import type { ProjectType } from "src/contentful/getProjects";
import type { ContentStatBlock } from "src/contentful/parseContentStatBlock";
import { useModal } from "src/hooks/useModal";
import { formatNumber } from "src/utils/numberHelpers";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectType;
  selectedServiceSlug?: string;
}

export const ProjectCard = (props: ProjectCardProps) => {
  const { project, selectedServiceSlug } = props;
  const { isOpen, open, close } = useModal();

  const { projectName, description, projectMedia, projectStats } = project;

  const projectStatsByService: (ContentStatBlock | null)[] | null =
    useMemo(() => {
      if (!projectStats) {
        return null;
      }

      if (!selectedServiceSlug) {
        return projectStats;
      }

      return projectStats?.filter(
        (stat) => stat?.statServiceReference === selectedServiceSlug,
      );
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
        <div>
          {projectMedia && projectMedia.length > 0 && (
            <MediaRenderer media={projectMedia[0]} />
          )}
        </div>
        <div className={styles.projectCardContent}>
          <header className={styles.projectCardHeader}>
            <h3>{projectName}</h3>
            <RichText document={description} />
          </header>
          <div className={styles.statsList}>
            <dl>
              {projectStatsByService?.map((stat) => {
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
        </div>
      </button>
      <ProjectModal isOpen={isOpen} onClose={close} project={project} />
    </>
  );
};
