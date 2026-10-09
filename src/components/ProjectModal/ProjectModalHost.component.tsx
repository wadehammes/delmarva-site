"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import {
  Activity,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  projectModalClosedPathAtom,
  projectModalOpenSlugAtom,
} from "src/atoms/projectModalAtoms";
import { ProjectModal } from "src/components/ProjectModal/ProjectModal.component";
import type { ProjectType } from "src/contentful/getProjects";

interface ProjectModalHostProps {
  projectSlugFromServer?: string | null;
  projects: ProjectType[];
}

export const ProjectModalHost = ({
  projectSlugFromServer = null,
  projects,
}: ProjectModalHostProps) => {
  const pathname = usePathname();
  const [openProjectSlug, setOpenProjectSlug] = useAtom(
    projectModalOpenSlugAtom,
  );
  const closedPathname = useAtomValue(projectModalClosedPathAtom);
  const setClosedPathname = useSetAtom(projectModalClosedPathAtom);
  const [cachedProject, setCachedProject] = useState<ProjectType | null>(null);

  const isClosedOnThisPath = closedPathname === pathname;
  const effectiveSlug = isClosedOnThisPath ? null : openProjectSlug;

  const activeProject = useMemo(
    () =>
      effectiveSlug
        ? (projects.find((project) => project.slug === effectiveSlug) ?? null)
        : null,
    [effectiveSlug, projects],
  );

  useLayoutEffect(() => {
    if (activeProject) {
      setCachedProject(activeProject);
    }
  }, [activeProject]);

  useLayoutEffect(() => {
    if (!isClosedOnThisPath && projectSlugFromServer && !openProjectSlug) {
      setOpenProjectSlug(projectSlugFromServer);
    }
  }, [
    isClosedOnThisPath,
    openProjectSlug,
    projectSlugFromServer,
    setOpenProjectSlug,
  ]);

  const close = useCallback(() => {
    setOpenProjectSlug(null);
    setClosedPathname(pathname);
    const url = new URL(window.location.href);
    if (url.searchParams.has("project")) {
      url.searchParams.delete("project");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, [pathname, setClosedPathname, setOpenProjectSlug]);

  if (!cachedProject) {
    return null;
  }

  const isOpen = activeProject !== null;
  const project = activeProject ?? cachedProject;

  return (
    <Activity mode={isOpen ? "visible" : "hidden"} name="ProjectModal">
      <ProjectModal isOpen={isOpen} onClose={close} project={project} />
    </Activity>
  );
};
