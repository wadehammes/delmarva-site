"use client";

import { useEffect, useRef } from "react";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useOptimizedInView({
    rootMargin: "100px 0px",
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      const play = () => {
        video.play().catch(() => setTimeout(play, 200));
      };
      play();
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      style={{ height: "100%", position: "relative" }}
      suppressHydrationWarning
    >
      <video
        autoPlay={false}
        height="100%"
        loop
        muted
        playsInline
        preload="auto"
        ref={videoRef}
        style={{
          height: "100%",
          left: 0,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        webkit-playsinline="true"
        width="100%"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
