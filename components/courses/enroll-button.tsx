"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/lib/actions/enrollments";

type EnrollButtonProps = {
  courseId: string;
  price: number;
  isEnrolled: boolean;
  isSignedIn: boolean;
};

export function EnrollButton({
  courseId,
  price,
  isEnrolled,
  isSignedIn,
}: EnrollButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (isEnrolled) {
    return (
      <Button size="lg" variant="outline" disabled>
        <CheckCircle2 className="size-4" />
        Enrolled
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <Button size="lg" nativeButton={false} render={<Link href="/sign-in" />}>
        Sign in to enroll
      </Button>
    );
  }

  if (price > 0) {
    return <Button size="lg" disabled>Enroll — coming soon</Button>;
  }

  function handleEnroll() {
    setError(null);
    startTransition(async () => {
      const result = await enrollInCourse(courseId);
      if (!result.success) {
        setError(result.error ?? "Enrollment failed.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" variant="gold" disabled={isPending} onClick={handleEnroll}>
        {isPending ? "Enrolling…" : "Enroll for free"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
