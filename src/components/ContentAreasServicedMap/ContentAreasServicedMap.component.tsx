"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import styles from "src/components/AreasServiced/AreasServiced.module.css";

const AreasServiced = dynamic(
  () =>
    import("src/components/AreasServiced/AreasServiced.component").then(
      (m) => ({ default: m.AreasServiced }),
    ),
  { ssr: false },
);

import type { ContentAreasServicedMap as ContentAreasServicedMapFields } from "src/contentful/parseContentAreasServicedMap";

interface ContentAreasServicedMapProps {
  fields: ContentAreasServicedMapFields;
}

export const ContentAreasServicedMap = (
  props: ContentAreasServicedMapProps,
) => {
  const { fields } = props;
  const { services } = fields;

  if (!services.length) return null;

  return (
    <div className={clsx(styles.wrapper)}>
      <AreasServiced services={services} />
    </div>
  );
};
