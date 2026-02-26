"use client";

import { useSearchParams } from "next/navigation";
import { AllProjectsList } from "src/components/AllProjectsList/AllProjectsList.component";
import type { ProjectType } from "src/contentful/getProjects";
import { resolveProjectSlug } from "src/utils/wordpressProjectSlugMap";

interface AllProjectsListWithUrlProps {
  projects: ProjectType[];
}

export const AllProjectsListWithUrl = ({
  projects,
}: AllProjectsListWithUrlProps) => {
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");
  const projectSlug = projectParam ? resolveProjectSlug(projectParam) : null;

  return <AllProjectsList projectSlug={projectSlug} projects={projects} />;
};
