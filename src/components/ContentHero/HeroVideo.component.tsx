"use client";

import ReactPlayer from "react-player";
import { useIsBrowser } from "src/hooks/useIsBrowser";

interface HeroVideoProps {
  src: string;
}

export const HeroVideo = ({ src }: HeroVideoProps) => {
  const isBrowser = useIsBrowser();

  if (!isBrowser) {
    return null;
  }

  return (
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
      playing={true}
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
  );
};
