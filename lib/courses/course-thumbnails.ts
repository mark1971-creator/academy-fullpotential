/** Bump when course thumbnail files change to bust browser and Next.js image cache. */
export const COURSE_THUMBNAIL_CACHE_VERSION = "10";

/** All course thumbnails are exported at 1600×1000 (16:10). */
export const COURSE_THUMBNAIL_ASPECT_CLASS = "aspect-[16/10]" as const;

export function withThumbnailCacheBust(url: string | null | undefined): string | null {
  if (!url) return null;
  const base = url.split("?")[0];
  return `${base}?v=${COURSE_THUMBNAIL_CACHE_VERSION}`;
}
