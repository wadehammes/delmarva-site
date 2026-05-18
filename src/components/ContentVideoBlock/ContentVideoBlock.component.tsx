"use client";

import clsx from "clsx";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import type { ContentVideoBlockType } from "src/contentful/parseContentVideoBlock";
import { useEntryReveal } from "src/hooks/useEntryReveal";
import { createMediaUrl } from "src/utils/urlHelpers";
import styles from "./ContentVideoBlock.module.css";

interface ContentVideoBlockProps {
  disableEntryReveal?: boolean;
  fields: ContentVideoBlockType;
}

interface ContentVideoBlockInnerProps {
  src: string;
}

const ContentVideoBlockPlain = (props: ContentVideoBlockInnerProps) => {
  const { src } = props;

  return (
    <div className={styles.root}>
      <VideoPlayer controls={true} rounded={true} src={src} />
    </div>
  );
};

const ContentVideoBlockWithReveal = (props: ContentVideoBlockInnerProps) => {
  const { src } = props;
  const { ref, revealClassName } = useEntryReveal();

  return (
    <div className={clsx(styles.root, revealClassName)} ref={ref}>
      <VideoPlayer controls={true} rounded={true} src={src} />
    </div>
  );
};

export const ContentVideoBlock = (props: ContentVideoBlockProps) => {
  const { disableEntryReveal = false, fields } = props;

  const video = fields.videoUpload?.src || fields.videoUrl;

  if (!video) {
    return null;
  }

  const src = createMediaUrl(video);

  return disableEntryReveal ? (
    <ContentVideoBlockPlain src={src} />
  ) : (
    <ContentVideoBlockWithReveal src={src} />
  );
};
