import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Delmarva Site Development Development",
    short_name: "Delmarva Site Development Development",
    description: "",
    start_url: "/",
    display: "standalone",
    background_color: "#e01e2d",
    theme_color: "#e01e2d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
