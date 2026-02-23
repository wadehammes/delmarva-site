"use client";

import type { EntryFields } from "contentful";
import Image from "next/image";
import { useMemo } from "react";
import { isValidProjectLocation } from "src/utils/mapUtils";
import { getProjectMapStaticUrl } from "src/utils/staticMapUrl";
import styles from "./ProjectStaticMap.module.css";

interface ProjectStaticMapProps {
  projectLocation: EntryFields.Location;
  height?: number;
  width?: number;
  zoom?: number;
}

export function useProjectStaticMapUrl(
  projectLocation: EntryFields.Location | undefined,
  options?: { height?: number; width?: number; zoom?: number },
): string | null {
  const { height, width, zoom } = options ?? {};
  return useMemo(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
    if (
      !projectLocation ||
      !token ||
      !isValidProjectLocation(projectLocation)
    ) {
      return null;
    }
    return getProjectMapStaticUrl(
      projectLocation.lon,
      projectLocation.lat,
      token,
      options,
    );
  }, [projectLocation?.lat, projectLocation?.lon, height, width, zoom]);
}

export const ProjectStaticMap = (props: ProjectStaticMapProps) => {
  const { projectLocation, height = 202, width = 360, zoom } = props;

  const staticMapUrl = useProjectStaticMapUrl(projectLocation, {
    height,
    width,
    zoom,
  });

  if (staticMapUrl) {
    return <Image alt="" height={height} src={staticMapUrl} width={width} />;
  }

  return (
    <div
      aria-hidden="true"
      className={styles.shimmer}
      style={{ height, width }}
    />
  );
};
