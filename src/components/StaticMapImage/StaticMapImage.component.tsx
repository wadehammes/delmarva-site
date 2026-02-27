"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Skeleton } from "src/components/Skeleton/Skeleton.component";
import { isValidProjectLocation } from "src/utils/mapUtils";
import { getProjectMapStaticUrl } from "src/utils/staticMapUrl";

interface StaticMapImageProps {
  height?: number;
  location: { lat: number; lon: number };
  width?: number;
  zoom?: number;
}

export function useStaticMapUrl(
  location: { lat: number; lon: number } | undefined,
  options?: { height?: number; width?: number; zoom?: number },
): string | null {
  const { height, width, zoom } = options ?? {};
  return useMemo(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN;
    if (!location || !token || !isValidProjectLocation(location)) {
      return null;
    }
    return getProjectMapStaticUrl(location.lon, location.lat, token, options);
  }, [location?.lat, location?.lon, height, width, zoom]);
}

export const StaticMapImage = (props: StaticMapImageProps) => {
  const { location, height = 202, width = 360, zoom } = props;

  const staticMapUrl = useStaticMapUrl(location, {
    height,
    width,
    zoom,
  });

  if (staticMapUrl) {
    return <Image alt="" height={height} src={staticMapUrl} width={width} />;
  }

  return <Skeleton height={height} variant="block" width={width} />;
};
