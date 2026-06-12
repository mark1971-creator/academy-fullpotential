"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses catalog error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">
        BEING at Full Potential
      </p>
      <h1 className="mt-3 font-heading text-3xl font-light">Could not load programs</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We had trouble fetching the course catalog. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
