import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/courses/utils";
import type { EnrollmentWithCourse } from "@/types/lms";

type EnrolledCoursesProps = {
  enrollments: EnrollmentWithCourse[];
};

export function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  if (enrollments.length === 0) {
    return (
      <div className="mt-8 rounded-sm border border-dashed border-border/80 bg-brand-warm/40 px-6 py-12 text-center">
        <p className="font-heading text-xl font-light text-foreground/80">
          Your enrolled courses will appear here
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Explore certification and training programs to begin your Human Potential
          journey.
        </p>
        <Button
          className="mt-6"
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
    <ul className="mt-8 grid gap-6 md:grid-cols-2">
      {enrollments.map((enrollment) => (
        <li key={enrollment.id}>
          <BrandCard className="flex h-full flex-col overflow-hidden p-0">
            {enrollment.course.thumbnailUrl ? (
              <div className="relative aspect-[16/9] bg-muted">
                <Image
                  src={enrollment.course.thumbnailUrl}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-brand-navy/5 to-brand-gold/10">
                <BookOpen className="size-8 text-brand-navy/35" strokeWidth={1.25} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
                {formatPrice(enrollment.course.price)}
              </p>
              <h3 className="mt-2 font-heading text-xl font-light leading-snug">
                {enrollment.course.title}
              </h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{enrollment.progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand-gold transition-all"
                    style={{ width: `${enrollment.progressPercent}%` }}
                  />
                </div>
              </div>
              <Button
                className="mt-6 w-full"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/courses/${enrollment.course.slug}`} />}
              >
                Continue learning
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </BrandCard>
        </li>
      ))}
    </ul>
  );
}
