import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { CourseThumbnailImage } from "@/components/catalog/course-thumbnail-image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { COURSE_THUMBNAIL_ASPECT_CLASS } from "@/lib/courses/course-thumbnails";
import { formatPrice } from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type { EnrollmentWithCourse } from "@/types/lms";

type EnrolledCoursesProps = {
  enrollments: EnrollmentWithCourse[];
};

export function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  if (enrollments.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-border/80 bg-brand-charcoal/30 px-8 py-14 text-center">
        <BookOpen className="mx-auto size-10 text-brand-blue/70" strokeWidth={1.25} />
        <p className="mt-5 font-heading text-xl font-light text-foreground">
          Your enrolled courses will appear here
        </p>
        <p className="mx-auto mt-3 max-w-md text-base text-brand-warm">
          Explore certification and training programs to begin your Human Potential
          journey.
        </p>
        <Button
          className="mt-8"
          variant="gold"
          nativeButton={false}
          render={<Link href="/courses" />}
        >
          Browse programs
        </Button>
      </div>
    );
  }

  return (
    <ul className="mt-10 grid gap-8 md:grid-cols-2">
      {enrollments.map((enrollment) => (
        <li key={enrollment.id}>
          <article
            className={cn(
              "academy-card-light flex h-full flex-col overflow-hidden transition-all duration-300",
              "hover:border-brand-teal/40 hover:shadow-[0_18px_40px_-16px_rgb(0_0_0_/_0.35)]",
            )}
          >
            {enrollment.course.thumbnailUrl ? (
              <div className={cn("relative bg-brand-charcoal/40", COURSE_THUMBNAIL_ASPECT_CLASS)}>
                <CourseThumbnailImage
                  src={enrollment.course.thumbnailUrl}
                  alt={enrollment.course.title}
                  objectPosition="top"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-gold/10",
                  COURSE_THUMBNAIL_ASPECT_CLASS,
                )}
              >
                <BookOpen className="size-10 text-brand-blue/50" strokeWidth={1.25} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                {formatPrice(enrollment.course.price)}
              </p>
              <h3 className="mt-3 font-heading text-xl font-light leading-snug text-foreground sm:text-2xl">
                {enrollment.course.title}
              </h3>
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-brand-warm">
                  <span>Progress</span>
                  <span className="font-semibold tabular-nums text-brand-gold">
                    {enrollment.progressPercent}%
                  </span>
                </div>
                <Progress
                  value={enrollment.progressPercent}
                  className="mt-3 h-2.5 bg-brand-charcoal/35"
                  indicatorClassName="from-brand-teal to-brand-gold"
                />
              </div>
              <Button
                className="mt-8 w-full border-border hover:border-brand-teal/50 hover:text-brand-teal"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/my-courses/${enrollment.course.slug}`} />}
              >
                Continue learning
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
