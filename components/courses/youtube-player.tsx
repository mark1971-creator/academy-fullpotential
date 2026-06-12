"use client";

import dynamic from "next/dynamic";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type YouTubePlayerProps = {
  url: string | null;
  title: string;
  className?: string;
};

export function YouTubePlayer({ url, title, className }: YouTubePlayerProps) {
  if (!url) {
    return (
      <div
        className={cn(
          "flex aspect-video flex-col items-center justify-center rounded-sm border border-dashed border-border bg-muted/40 text-center",
          className,
        )}
      >
        <Play className="size-10 text-brand-navy/30" strokeWidth={1.25} />
        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
          Video for &ldquo;{title}&rdquo; will appear here once a YouTube URL is added.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("aspect-video overflow-hidden rounded-sm bg-black", className)}>
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls
        playsInline
        config={{
          youtube: {
            rel: 0,
          },
        }}
      />
    </div>
  );
}
