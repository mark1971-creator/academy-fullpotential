import Image from "next/image";

import { cn } from "@/lib/utils";

type CourseThumbnailImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  /** Prefer top when the container aspect ratio differs slightly from 16:10. */
  objectPosition?: "center" | "top";
};

/** Local /Images/ thumbnails skip the optimizer to avoid stale cache and query-string issues. */
export function CourseThumbnailImage({
  src,
  alt,
  className,
  imageClassName,
  objectPosition = "center",
}: CourseThumbnailImageProps) {
  return (
    <div className={cn("relative size-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className={cn(
          "object-cover",
          objectPosition === "top" ? "object-top" : "object-center",
          imageClassName,
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />
    </div>
  );
}
