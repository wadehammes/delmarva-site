import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
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
    name: "Delmarva Site Development",
    short_name: "Delmarva Site Development",
    start_url: "/",
    theme_color: "#e01e2d",
  };
}
