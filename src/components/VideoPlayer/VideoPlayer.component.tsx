"use client";

import classNames from "classnames";
import React from "react";
import ReactPlayer from "react-player";
import styles from "./VideoPlayer.module.css";

export interface VideoPlayerProps {
  /** URL of the video (YouTube, Vimeo, or local file) */
  url: string;
  /** Optional className for additional styling */
  className?: string;
  /** Whether the video should loop (default: false) */
  loop?: boolean;
  /** Whether the video should be muted (default: false) */
  muted?: boolean;
  /** Whether the video should play automatically (default: false) */
  playing?: boolean;
  /** Volume level (0-1, default: 1) */
  volume?: number;
  /** Whether to show player controls (default: true) */
  controls?: boolean;
  /** Whether to show play/pause button (default: false) */
  light?: boolean;
  /** Width of the video container (default: '100%') */
  width?: string | number;
  /** Height of the video container (default: 'auto') */
  height?: string | number;
  /** Object fit style for the video (default: 'contain') */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Whether to show a fallback image when video fails to load */
  fallbackImage?: string;
  /** Whether to show progress bar (default: true) */
  progressInterval?: number;
  /** Whether to show video title (default: false) */
  showTitle?: boolean;
  /** Custom poster image */
  poster?: string;
  /** Callback when video is ready to play */
  onReady?: () => void;
  /** Callback when video starts playing */
  onPlay?: () => void;
  /** Callback when video is paused */
  onPause?: () => void;
  /** Callback when video ends */
  onEnded?: () => void;
  /** Callback when video encounters an error */
  onError?: (error: Error | string) => void;
  /** Callback when video progress changes */
  onProgress?: (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => void;
  /** Callback when video duration is loaded */
  onDuration?: (duration: number) => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    url,
    className,
    loop = false,
    muted = false,
    playing = false,
    volume = 1,
    controls = true,
    light = false,
    width = "100%",
    height = "auto",
    objectFit = "contain",
    fallbackImage,
    progressInterval = 1000,
    showTitle = false,
    poster,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onError,
    onProgress,
    onDuration,
  } = props;

  const [hasError, setHasError] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleError = (error: Error | string) => {
    setHasError(true);
    onError?.(error);
  };

  const handleReady = () => {
    setHasError(false);
    onReady?.();
  };

  if (hasError && fallbackImage) {
    return (
      <div
        className={classNames(styles.container, className)}
        style={{
          width,
          height,
          backgroundImage: `url(${fallbackImage})`,
          backgroundSize: objectFit,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }

  if (!isMounted) {
    return (
      <div
        className={classNames(styles.container, className)}
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div>Loading video...</div>
      </div>
    );
  }

  return (
    <div
      className={classNames(styles.container, className)}
      style={{ width, height }}
    >
      <ReactPlayer
        url={url}
        className={styles.player}
        width="100%"
        height="100%"
        playing={playing}
        loop={loop}
        muted={muted}
        volume={volume}
        controls={controls}
        light={light}
        poster={poster}
        progressInterval={progressInterval}
        onReady={handleReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onError={handleError}
        onProgress={onProgress}
        onDuration={onDuration}
        config={{
          youtube: {
            playerVars: {
              controls: controls ? 1 : 0,
              disablekb: !controls,
              fs: controls ? 1 : 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0,
              showinfo: showTitle ? 1 : 0,
            },
          },
          vimeo: {
            playerOptions: {
              controls: controls,
              autopause: !loop,
              background: false,
              dnt: true,
              responsive: true,
              title: showTitle,
            },
          },
          file: {
            attributes: {
              style: {
                objectFit,
              },
              poster,
            },
          },
        }}
      />
    </div>
  );
};
