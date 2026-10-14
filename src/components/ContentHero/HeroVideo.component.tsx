"use client";

import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const { ref, inView } = useOptimizedInView({
    rootMargin: "100px 0px",
    threshold: 0.1,
    triggerOnce: false,
  });

  return (
    <div
      ref={ref}
      style={{ height: "100%", position: "relative" }}
      suppressHydrationWarning
    >
      <VideoPlayer fill playInView={inView} src={src} />
    </div>
  );
};
