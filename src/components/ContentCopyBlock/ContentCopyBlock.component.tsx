"use client";

import clsx from "clsx";
import { forwardRef, type Ref } from "react";
import { useObjectRef } from "react-aria";
import styles from "src/components/ContentCopyBlock/ContentCopyBlock.module.css";
import { CTA } from "src/components/CTA/CTA.component";
import { RichText } from "src/components/RichText/RichText.component";
import { StaticMapImage } from "src/components/StaticMapImage/StaticMapImage.component";
import type { CopyBlock } from "src/contentful/parseCopyBlock";
import { Alignment } from "src/interfaces/common.interfaces";
import { isValidProjectLocation } from "src/utils/mapUtils";

interface ContentCopyBlockProps {
  fields: CopyBlock | null;
}

export const ContentCopyBlock = forwardRef<
  HTMLDivElement,
  ContentCopyBlockProps
>((props, ref: Ref<HTMLDivElement>) => {
  const { fields } = props;
  const divRef = useObjectRef(ref);

  if (!fields) {
    return null;
  }

  const {
    id,
    copy,
    cta,
    slug,
    copyEyebrow,
    staticLocationImage,
    staticLocationImagePlacement,
  } = fields;

  if (!copy) {
    return null;
  }

  const showStaticMap =
    staticLocationImage && isValidProjectLocation(staticLocationImage);
  const mapAbove = staticLocationImagePlacement === "Above Copy";

  const mapNode = showStaticMap ? (
    <div className={styles.staticMap} key="map">
      <StaticMapImage location={staticLocationImage} />
    </div>
  ) : null;

  const copyNode = <RichText document={copy} key="copy" />;

  const orderedChildren = mapAbove ? [mapNode, copyNode] : [copyNode, mapNode];

  return (
    <div
      className={clsx(styles.copyBlock, {
        [styles.mobileAlignLeft]: fields.mobileAlignment === Alignment.Left,
        [styles.mobileAlignRight]: fields.mobileAlignment === Alignment.Right,
        [styles.desktopAlignLeft]: fields.alignment === Alignment.Left,
        [styles.desktopAlignRight]: fields.alignment === Alignment.Right,
      })}
      id={slug || id}
      ref={divRef}
    >
      {copyEyebrow ? (
        <div className={styles.copyEyebrow}>
          <p>{copyEyebrow}</p>
        </div>
      ) : null}
      {orderedChildren}
      {cta ? (
        <div className={styles.ctaContainer}>
          <CTA cta={cta} />
        </div>
      ) : null}
    </div>
  );
});
