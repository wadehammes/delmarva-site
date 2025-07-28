"use client";

import ReactPlayer from "react-player";
import { useIsBrowser } from "src/hooks/useIsBrowser";
import { useOptimizedInView } from "src/hooks/useOptimizedInView";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const isBrowser = useIsBrowser();
  const { ref, inView } = useOptimizedInView({
    rootMargin: "100px 0px", // Start loading 100px before video comes into view
    threshold: 0.1, // Start playing when 10% of video is visible
    triggerOnce: false, // Allow multiple triggers as user scrolls
  });

  if (!isBrowser) {
    return null;
  }

  return (
    <div ref={ref} style={{ height: "100%", position: "relative" }}>
      <ReactPlayer
        config={{
          vimeo: {
            autopause: false,
            background: true,
            controls: false,
            dnt: true,
            responsive: true,
            title: false,
          },
          youtube: {
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            rel: 0,
          },
        }}
        controls={false}
        height="100%"
        loop
        muted
        playing={inView}
        src={src}
        style={{
          height: "100%",
          left: 0,
          objectFit: "cover",
          position: "absolute",
          top: 0,
          width: "100%",
        }}
        width="100%"
      />
    </div>
  );
};
