import { draftMode } from "next/headers";
import { fetchProjects } from "src/contentful/getProjects";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { resolveProjectSlug } from "src/utils/wordpressProjectSlugMap";
import { AllProjectsList } from "./AllProjectsList.component";

interface AllProjectsListServerProps {
  locale?: string;
  searchParams?: { project?: string };
}

export const AllProjectsListServer = async (
  props?: AllProjectsListServerProps,
) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const projects = await fetchProjects({
    locale,
    preview: draft.isEnabled,
  });

  const projectParam = props?.searchParams?.project;
  const projectSlug = projectParam ? resolveProjectSlug(projectParam) : null;

  return <AllProjectsList projectSlug={projectSlug} projects={projects} />;
};
