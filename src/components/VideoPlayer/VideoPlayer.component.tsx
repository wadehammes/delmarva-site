"use client";

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { useIsBrowser } from "src/hooks/useIsBrowser";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  autoPlay?: boolean;
  controls?: boolean;
  playInView?: boolean;
  rounded?: boolean;
  src: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = false,
    controls = false,
    playInView = false,
    rounded = false,
    src,
  } = props;
  const isBrowser = useIsBrowser();
  const [debouncedPlayInView, setDebouncedPlayInView] = useState(playInView);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedPlayInView(playInView);
    }, 200); // 200ms delay to prevent rapid play/pause

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playInView]);

  if (!isBrowser) {
    return null;
  }

  return (
    <div className={clsx(styles.container)} data-video-player>
      <div
        className={clsx(styles.player, {
          [styles.rounded]: rounded,
        })}
      >
        <ReactPlayer
          config={{
            vimeo: {
              autopause: !autoPlay,
              background: false,
              controls: controls,
              dnt: true,
              responsive: true,
              title: false,
            },
            youtube: {
              disablekb: !controls ? 1 : 0,
              fs: controls ? 1 : 0,
              iv_load_policy: 3,
              rel: 0,
            },
          }}
          controls={controls}
          height="100%"
          loop
          muted={autoPlay || debouncedPlayInView}
          playing={autoPlay || debouncedPlayInView}
          src={src}
          width="100%"
        />
      </div>
    </div>
  );
};
