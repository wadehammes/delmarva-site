"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import styles from "src/components/AreasServicedMap/AreasServicedMap.module.css";
import type { ContentAreasServicedMap as ContentAreasServicedMapFields } from "src/contentful/parseContentAreasServicedMap";

const AreasServicedMapFromServices = dynamic(
  () =>
    import(
      "src/components/ContentAreasServicedMap/AreasServicedMapFromServices.component"
    ).then((m) => ({ default: m.AreasServicedMapFromServices })),
  { ssr: false },
);

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
      <AreasServicedMapFromServices services={services} />
    </div>
  );
};
