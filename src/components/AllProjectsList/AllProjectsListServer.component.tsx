import { draftMode } from "next/headers";
import { fetchProjects } from "src/contentful/getProjects";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";
import { AllProjectsList } from "./AllProjectsList.component";

interface AllProjectsListServerProps {
  locale?: string;
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

  return <AllProjectsList projects={projects} />;
};
