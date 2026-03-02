"use client";

import { ProjectsCarousel } from "src/components/ProjectsCarousel/ProjectsCarousel.component";
import type { ProjectType } from "src/contentful/getProjects";

interface AllProjectsListProps {
  projectSlug?: string | null;
  projects: ProjectType[];
}

export const AllProjectsList = ({
  projectSlug: projectSlugFromServer = null,
  projects,
}: AllProjectsListProps) => (
  <ProjectsCarousel
    projectSlugFromServer={projectSlugFromServer}
    projects={projects}
    syncUrlOnOpen
  />
);
