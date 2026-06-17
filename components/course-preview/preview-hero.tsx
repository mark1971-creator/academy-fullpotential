import { Clock, GraduationCap, Star, Users } from "lucide-react";
import Link from "next/link";

import { EnrollCta } from "@/components/course-preview/enroll-cta";
import { YouTubePlayer } from "@/components/courses/youtube-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/courses/utils";
import type { CoursePreview } from "@/types/lms";

type PreviewHeroProps = {
  course: CoursePreview;
  lessonCount: number;
  heroVideoUrl: string | null;
  isEnrolled: boolean;
};

export function PreviewHero({
  course,
  lessonCount,
  heroVideoUrl,
  isEnrolled,
}: PreviewHeroProps) {
  const headline = course.tagline ?? course.description;

  return (
    <section className="academy-card-elevated overflow-hidden">
      <div className="grid gap-10 p-7 sm:p-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14 lg:p-12">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge className="border-transparent bg-brand-gold px-3 py-1 text-brand-charcoal">
              {formatPrice(course.price)}
            </Badge>
            {course.level && (
              <Badge variant="outline" className="gap-1 border-brand-teal/40 text-brand-teal">
                <GraduationCap className="size-3" />
                {course.level}
              </Badge>
            )}
          </div>

          <h1 className="mt-5 font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {course.title}
          </h1>

          {course.rating != null && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-brand-surface-elevated/60 px-3 py-1.5">
                <span className="text-lg font-semibold text-foreground">
                  {course.rating.toFixed(1)}
                </span>
                <Star className="size-4 fill-brand-gold text-brand-gold" />
                {course.ratingCount > 0 && (
                  <span className="text-sm text-brand-warm">
                    ({course.ratingCount} reviews)
                  </span>
                )}
              </div>
            </div>
          )}

          {headline && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-warm sm:text-lg">
              {headline}
            </p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:gap-8">
            {course.durationLabel && (
              <Stat icon={Clock} label="Duration" value={course.durationLabel} />
            )}
            <Stat
              icon={GraduationCap}
              label="Modules"
              value={String(course.modules.length)}
            />
            <Stat icon={Users} label="Enrolled" value={String(course.enrolledCount)} />
            {lessonCount > 0 && (
              <Stat icon={GraduationCap} label="Lessons" value={String(lessonCount)} />
            )}
          </div>

          {course.tags.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="muted" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-start">
            <EnrollCta
              courseSlug={course.slug}
              price={course.price}
              isEnrolled={isEnrolled}
            />
            <Button
              variant="outline"
              size="lg"
              className="border-brand-teal/30 hover:border-brand-teal/60 hover:text-brand-teal"
              nativeButton={false}
              render={<Link href="/courses" />}
            >
              Back to catalog
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-border bg-brand-charcoal shadow-[0_16px_48px_-20px_rgb(0_0_0_/_0.65)]">
          <CardContent className="p-0">
            <YouTubePlayer
              url={heroVideoUrl}
              title={course.title}
              className="rounded-none"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-lg bg-brand-teal/15 text-brand-teal">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-brand-warm">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
