import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Turbopack is the default bundler in Next.js 16 and is more memory-efficient
  // than the (deprecated) webpack path, so we keep it enabled. `root` pins the
  // workspace root to avoid Turbopack scanning parent directories.
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
  // Dev-server memory: keep fewer compiled pages resident and evict them sooner.
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    // Compile route entries on first request instead of eagerly loading every
    // route into memory when `next dev` starts — a meaningful dev-RAM win.
    preloadEntriesOnStart: false,
    // Scale the build / static-generation worker pool to available memory so
    // peak usage doesn't spike on memory-constrained Windows machines.
    memoryBasedWorkersCount: true,
  },
};

export default nextConfig;
