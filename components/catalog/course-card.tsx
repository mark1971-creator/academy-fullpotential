import { ArrowRight, Award, BookOpen, Clock, GraduationCap } from "lucide-react";
import Link from "next/link";

import { CourseThumbnailImage } from "@/components/catalog/course-thumbnail-image";
import { Button } from "@/components/ui/button";
import { formatIcfCceuLabel, getCourseIcfCceus } from "@/lib/courses/icf-credentials";
import { formatPrice, truncateText } from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/lms";

type CourseCardProps = {
  course: Course;
  className?: string;
};

export function CourseCard({ course, className }: CourseCardProps) {
  const icfCceus = getCourseIcfCceus(course.slug);

  return (
    <article
      className={cn(
        "academy-catalog-card group flex h-full flex-col overflow-hidden transition-all duration-300",
        className,
      )}
    >
      {course.thumbnailUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-charcoal/20">
          <CourseThumbnailImage
            src={course.thumbnailUrl}
            alt={course.title}
            imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 via-transparent to-transparent"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-gold/12 via-brand-surface-elevated/30 to-brand-blue/8">
          <BookOpen className="size-11 text-brand-gold/55" strokeWidth={1.25} />
        </div>
      )}

      <div className="flex flex-1 flex-col p-8 sm:p-9">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold-light">
            {formatPrice(course.price)}
          </span>
          {icfCceus != null && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-teal">
              <Award className="size-3.5" />
              {formatIcfCceuLabel(icfCceus)}
            </span>
          )}
          {course.level && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-warm">
              <GraduationCap className="size-3.5" />
              {course.level}
            </span>
          )}
        </div>

        <h2 className="mt-5 font-heading text-[1.65rem] font-normal leading-snug text-foreground sm:text-[1.75rem]">
          {course.title}
        </h2>

        {course.durationLabel && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-brand-warm">
            <Clock className="size-3.5 shrink-0 text-brand-gold/70" />
            {course.durationLabel}
          </p>
        )}

        <p className="mt-5 flex-1 text-[0.975rem] leading-[1.7] text-brand-warm-soft">
          {course.description
            ? truncateText(course.description, 155)
            : "Explore this transformational program."}
        </p>

        <Button
          variant="outline"
          className="mt-9 w-full border-white/15 bg-white/5 text-foreground hover:border-brand-gold/50 hover:bg-brand-gold/12 hover:text-brand-gold-light"
          nativeButton={false}
          render={<Link href={`/courses/${course.slug}`} />}
        >
          View Course
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}
