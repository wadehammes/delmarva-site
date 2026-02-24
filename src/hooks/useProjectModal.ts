import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect } from "react";
import {
  projectModalClosedPathAtom,
  projectModalOpenSlugAtom,
} from "src/atoms/projectModalAtoms";

interface UseProjectModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

interface UseProjectModalConfig {
  projectSlug: string;
  projectSlugFromServer: string | null;
}

export const useProjectModal = (
  config: UseProjectModalConfig,
): UseProjectModalReturn => {
  const { projectSlug, projectSlugFromServer } = config;
  const pathname = usePathname();
  const [openProjectSlug, setOpenProjectSlug] = useAtom(
    projectModalOpenSlugAtom,
  );
  const closedPathname = useAtomValue(projectModalClosedPathAtom);
  const setClosedPathname = useSetAtom(projectModalClosedPathAtom);

  const isClosedOnThisPath = closedPathname === pathname;
  const effectiveSlug = isClosedOnThisPath ? null : openProjectSlug;
  const isOpen = effectiveSlug === projectSlug;

  useLayoutEffect(() => {
    if (!isClosedOnThisPath && projectSlugFromServer && !openProjectSlug) {
      setOpenProjectSlug(projectSlugFromServer);
    }
  }, [
    isClosedOnThisPath,
    projectSlugFromServer,
    openProjectSlug,
    setOpenProjectSlug,
  ]);

  const open = useCallback(() => {
    setClosedPathname(null);
    setOpenProjectSlug(projectSlug);
  }, [projectSlug, setOpenProjectSlug, setClosedPathname]);

  const close = useCallback(() => {
    setOpenProjectSlug(null);
    setClosedPathname(pathname);
    const url = new URL(window.location.href);
    if (url.searchParams.has("project")) {
      url.searchParams.delete("project");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  }, [pathname, setOpenProjectSlug, setClosedPathname]);

  const toggle = useCallback(
    () => (isOpen ? close() : open()),
    [isOpen, open, close],
  );

  return { close, isOpen, open, toggle };
};
