"use client";

import { useIsBrowser } from "src/hooks/useIsBrowser";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const isBrowser = useIsBrowser();
  const { ref, inView } = useOptimizedInView({
    rootMargin: "100px 0px",
    threshold: 0.1,
    triggerOnce: false,
  });

  if (!isBrowser) {
    return null;
  }

  return (
    <div ref={ref} style={{ height: "100%", position: "relative" }}>
      <video
        autoPlay={inView}
        height="100%"
        loop
        muted
        playsInline
        style={{
          height: "100%",
          left: 0,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        width="100%"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
