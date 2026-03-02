"use client";

import clsx from "clsx";
import { AreasServiced } from "src/components/AreasServiced/AreasServiced.component";
import styles from "src/components/AreasServiced/AreasServiced.module.css";
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
