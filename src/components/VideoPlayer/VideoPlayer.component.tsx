"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import {
  isDirectVideoFile,
  isVimeoUrl,
  isYouTubeUrl,
} from "src/utils/videoUrl.helpers";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  autoPlay?: boolean;
  controls?: boolean;
  fill?: boolean;
  loop?: boolean;
  playInView?: boolean;
  rounded?: boolean;
  src: string;
  title?: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = false,
    controls = false,
    fill = false,
    loop,
    playInView = false,
    rounded = false,
    src,
    title = "Video player",
  } = props;
  const [mounted, setMounted] = useState(false);
  const [debouncedPlayInView, setDebouncedPlayInView] = useState(playInView);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedPlayInView(playInView);
    }, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playInView]);

  if (!src?.trim()) {
    return null;
  }

  const isEmbed = isYouTubeUrl(src) || isVimeoUrl(src);
  const shouldLoop = loop ?? (isDirectVideoFile(src) || !isEmbed);
  const shouldMute = autoPlay || debouncedPlayInView;
  const shouldPlay = autoPlay || debouncedPlayInView;

  if (!mounted) {
    return (
      <div
        className={clsx(styles.container, { [styles.fill]: fill })}
        data-video-player
      >
        <div
          className={clsx(styles.player, {
            [styles.cover]: fill,
            [styles.rounded]: rounded,
          })}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.container, { [styles.fill]: fill })}
      data-video-player
    >
      <div
        className={clsx(styles.player, {
          [styles.cover]: fill,
          [styles.rounded]: rounded,
        })}
      >
        <ReactPlayer
          config={isYouTubeUrl(src) ? { youtube: { rel: 0 } } : undefined}
          controls={controls}
          height="100%"
          loop={shouldLoop}
          muted={shouldMute}
          playing={shouldPlay}
          playsInline
          src={src}
          title={title}
          width="100%"
        />
      </div>
    </div>
  );
};
