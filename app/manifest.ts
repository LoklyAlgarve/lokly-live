import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lokly",
    short_name: "Lokly",
    description: "Discover events across the Algarve",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#149EAF",
    icons: [
      {
        src: "/icons/lokly-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/lokly-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}