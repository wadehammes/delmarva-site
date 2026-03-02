"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { isDirectVideoFile, isVimeoUrl, isYouTubeUrl } from "src/utils/helpers";

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

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

  const useNativeVideo = isDirectVideoFile(src);
  const useYouTube = isYouTubeUrl(src);
  const useVimeo = isVimeoUrl(src);

  if (!mounted) {
    return (
      <div className={clsx(styles.container)} data-video-player>
        <div className={clsx(styles.player, { [styles.rounded]: rounded })} />
      </div>
    );
  }

  const shouldMute = autoPlay || debouncedPlayInView;
  const shouldPlay = autoPlay || debouncedPlayInView;

  if (useNativeVideo) {
    return (
      <div className={clsx(styles.container)} data-video-player>
        <div
          className={clsx(styles.player, {
            [styles.rounded]: rounded,
          })}
        >
          <video
            autoPlay={shouldPlay}
            controls={controls}
            loop
            muted={shouldMute}
            playsInline
            src={src}
            style={{
              height: "100%",
              objectFit: "contain",
              width: "100%",
            }}
          />
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = useYouTube ? getYouTubeEmbedUrl(src) : null;
  const vimeoEmbedUrl = useVimeo ? getVimeoEmbedUrl(src) : null;
  const embedUrl = youtubeEmbedUrl || vimeoEmbedUrl;

  if (embedUrl) {
    const params = new URLSearchParams();
    if (shouldPlay) params.set("autoplay", "1");
    if (shouldMute) params.set("muted", "1");
    if (youtubeEmbedUrl) {
      params.set("rel", "0");
      if (controls) params.set("controls", "1");
    }
    const separator = embedUrl.includes("?") ? "&" : "?";
    const finalUrl = `${embedUrl}${separator}${params.toString()}`;

    return (
      <div className={clsx(styles.container)} data-video-player>
        <div
          className={clsx(styles.player, {
            [styles.rounded]: rounded,
          })}
        >
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            src={finalUrl}
            style={{
              border: "none",
              height: "100%",
              width: "100%",
            }}
            title="Video player"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container)} data-video-player>
      <div
        className={clsx(styles.player, {
          [styles.rounded]: rounded,
        })}
      >
        <video
          controls={controls}
          loop
          muted={shouldMute}
          playsInline
          src={src}
          style={{
            height: "100%",
            objectFit: "contain",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};
