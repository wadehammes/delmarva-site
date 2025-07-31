"use client";

import { useEffect, useRef } from "react";
import { useIsBrowser } from "src/hooks/useIsBrowser";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const isBrowser = useIsBrowser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useOptimizedInView({
    rootMargin: "100px 0px",
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (videoRef.current && inView) {
      // iOS Safari requires explicit play() call
      const playVideo = async () => {
        try {
          if (videoRef.current) {
            await videoRef.current.play();
          }
        } catch (error) {
          console.log("Video autoplay failed:", error);
          // On iOS, we might need to wait for user interaction
          // Try again after a short delay
          setTimeout(() => {
            if (videoRef.current && inView) {
              videoRef.current.play().catch(console.log);
            }
          }, 100);
        }
      };
      playVideo();
    } else if (videoRef.current && !inView) {
      videoRef.current.pause();
    }
  }, [inView]);

  if (!isBrowser) {
    return null;
  }

  return (
    <div ref={ref} style={{ height: "100%", position: "relative" }}>
      <video
        autoPlay={false}
        height="100%" // We'll handle autoplay manually
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
