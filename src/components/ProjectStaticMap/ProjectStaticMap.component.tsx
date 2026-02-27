"use client";

import type { EntryFields } from "contentful";
import { StaticMapImage } from "src/components/StaticMapImage/StaticMapImage.component";

interface ProjectStaticMapProps {
  projectLocation: EntryFields.Location;
  height?: number;
  width?: number;
  zoom?: number;
}

export const ProjectStaticMap = (props: ProjectStaticMapProps) => (
  <StaticMapImage
    height={props.height}
    location={props.projectLocation}
    width={props.width}
    zoom={props.zoom}
  />
);
