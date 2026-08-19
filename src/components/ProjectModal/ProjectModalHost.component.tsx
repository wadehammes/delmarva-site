"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useMemo } from "react";
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

  if (!activeProject) {
    return null;
  }

  return <ProjectModal isOpen onClose={close} project={activeProject} />;
};
