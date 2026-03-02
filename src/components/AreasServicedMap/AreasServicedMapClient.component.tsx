"use client";

import dynamic from "next/dynamic";
import type { ServiceType } from "src/contentful/getServices";

const AreasServicedMap = dynamic(
  () =>
    import("./AreasServicedMap.component").then((m) => ({
      default: m.AreasServicedMap,
    })),
  { ssr: false },
);

interface AreasServicedMapClientProps {
  autoFitBounds?: boolean;
  center?: [number, number];
  className?: string;
  height?: string;
  services: ServiceType[];
  zoom?: number;
}

export const AreasServicedMapClient = (props: AreasServicedMapClientProps) => (
  <AreasServicedMap {...props} />
);
