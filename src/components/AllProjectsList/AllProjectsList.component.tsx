"use client";

import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import type { ProjectType } from "src/contentful/getProjects";

interface AllProjectsListProps {
  projectSlug?: string | null;
  projects: ProjectType[];
}

export const AllProjectsList = ({
  projectSlug = null,
  projects,
}: AllProjectsListProps) => (
  <>
    {projects.map((project) => (
      <ProjectCard
        key={project.id}
        openOnMount={projectSlug != null && project.slug === projectSlug}
        project={project}
      />
    ))}
  </>
);
