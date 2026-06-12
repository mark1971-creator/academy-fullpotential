import { BookOpen, Clock, GraduationCap, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { EnrollButton } from "@/components/courses/enroll-button";
import { YouTubePlayer } from "@/components/courses/youtube-player";
import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/courses/utils";
import type { CourseWithCurriculum } from "@/types/lms";

type CourseHeroProps = {
  course: CourseWithCurriculum;
  lessonCount: number;
  isEnrolled: boolean;
  isSignedIn: boolean;
};

export function CourseHero({
  course,
  lessonCount,
  isEnrolled,
  isSignedIn,
}: CourseHeroProps) {
  const hasHeroVideo =
    course.heroVideoUrl && !course.heroVideoUrl.includes("[REPLACE");

  return (
    <section className="overflow-hidden rounded-sm border border-border/70 bg-gradient-to-br from-brand-cream via-card to-brand-warm/60">
      <div className="grid gap-10 p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:p-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
              {formatPrice(course.price)}
            </p>
            {course.level && (
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-card/80 px-2.5 py-1 text-xs text-muted-foreground">
                <GraduationCap className="size-3.5" />
                {course.level}
              </span>
            )}
          </div>

          <h1 className="mt-3 font-heading text-4xl font-light tracking-tight sm:text-5xl">
            {course.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {course.description ?? "A transformational learning experience."}
          </p>

          <ul className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {course.durationLabel && (
              <li className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-brand-gold" />
                {course.durationLabel}
              </li>
            )}
            <li>
              {course.modules.length} module{course.modules.length === 1 ? "" : "s"}
            </li>
            <li aria-hidden="true">·</li>
            <li>
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </li>
            {course.rating != null && course.ratingCount > 0 && (
              <>
                <li aria-hidden="true">·</li>
                <li className="inline-flex items-center gap-1">
                  <Star className="size-4 fill-brand-gold text-brand-gold" />
                  {course.rating.toFixed(1)} ({course.ratingCount})
                </li>
              </>
            )}
            {course.enrolledCount > 0 && (
              <>
                <li aria-hidden="true">·</li>
                <li className="inline-flex items-center gap-1">
                  <Users className="size-4" />
                  {course.enrolledCount} enrolled
                </li>
              </>
            )}
          </ul>

          {course.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-brand-navy/10 bg-brand-navy/5 px-3 py-1 text-xs text-brand-navy/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <EnrollButton
              courseId={course.id}
              price={course.price}
              isEnrolled={isEnrolled}
              isSignedIn={isSignedIn}
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/courses" />}
            >
              Back to catalog
            </Button>
          </div>
        </div>

        {hasHeroVideo ? (
          <YouTubePlayer url={course.heroVideoUrl} title={course.title} />
        ) : course.thumbnailUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-sm bg-muted">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        ) : (
          <BrandCard className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand-navy/5 to-brand-gold/10">
            <BookOpen className="size-14 text-brand-navy/35" strokeWidth={1.1} />
          </BrandCard>
        )}
      </div>

      {course.whatYouWillLearn.length > 0 && (
        <div className="border-t border-border/60 px-8 py-8 lg:px-12">
          <h2 className="font-heading text-2xl font-light">What you&apos;ll learn</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {course.whatYouWillLearn.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
