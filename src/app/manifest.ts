import type { MetadataRoute } from "next";
import { SITE_NAME } from "src/utils/constants";

const manifest = (): MetadataRoute.Manifest => {
  return {
    background_color: "#e01e2d",
    description: "",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    name: SITE_NAME,
    short_name: SITE_NAME,
    start_url: "/",
    theme_color: "#e01e2d",
  };
};

export default manifest;
