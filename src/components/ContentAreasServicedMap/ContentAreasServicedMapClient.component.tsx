"use client";

import dynamic from "next/dynamic";
import type { ContentAreasServicedMap as ContentAreasServicedMapFields } from "src/contentful/parseContentAreasServicedMap";
import { MapErrorBoundary } from "./MapErrorBoundary.component";

const ContentAreasServicedMap = dynamic(
  () =>
    import(
      "src/components/ContentAreasServicedMap/ContentAreasServicedMap.component"
    ).then((m) => ({ default: m.ContentAreasServicedMap })),
  { ssr: false },
);

interface ContentAreasServicedMapClientProps {
  fields: ContentAreasServicedMapFields;
}

export const ContentAreasServicedMapClient = (
  props: ContentAreasServicedMapClientProps,
) => (
  <MapErrorBoundary>
    <ContentAreasServicedMap fields={props.fields} />
  </MapErrorBoundary>
);
