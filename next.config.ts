import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  turbopack: {
    root: projectRoot,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/Images/**",
      },
    ],
  },

  // Dev-server only — reduces memory use during `next dev`.
  ...(isDev && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
    experimental: {
      preloadEntriesOnStart: false,
      memoryBasedWorkersCount: true,
    },
  }),
};

export default nextConfig;
