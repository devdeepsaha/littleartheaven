import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Little Art Heaven",
    short_name: "Little Art Heaven",
    description:
      "Handmade gifts and custom keepsakes by Srijita Nandy, including frames, lockets, clay art, and painted accessories.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf7",
    theme_color: "#fff8f4",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
