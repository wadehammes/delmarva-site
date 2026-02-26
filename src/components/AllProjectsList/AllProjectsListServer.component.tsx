import { draftMode } from "next/headers";
import { Suspense } from "react";
import { AllProjectsListWithUrl } from "src/components/AllProjectsList/AllProjectsListWithUrl.component";
import { fetchProjects } from "src/contentful/getProjects";
import { getServerLocaleSafe } from "src/hooks/useServerLocale";

export const AllProjectsListServer = async (props?: { locale?: string }) => {
  const draft = await draftMode();
  const locale = await getServerLocaleSafe(props?.locale);

  const projects = await fetchProjects({
    locale,
    preview: draft.isEnabled,
  });

  return (
    <Suspense fallback={null}>
      <AllProjectsListWithUrl projects={projects} />
    </Suspense>
  );
};
