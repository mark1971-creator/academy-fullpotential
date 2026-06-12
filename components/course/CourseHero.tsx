import { CheckCircle2, Clock, GraduationCap, Star, Users } from "lucide-react";
import Link from "next/link";

import { EnrollButton } from "@/components/courses/enroll-button";
import { YouTubePlayer } from "@/components/courses/youtube-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/courses/utils";
import type { CourseWithCurriculum } from "@/types/lms";

type CourseHeroProps = {
  course: CourseWithCurriculum;
  lessonCount: number;
  heroVideoUrl: string | null;
  isEnrolled: boolean;
  isSignedIn: boolean;
};

export function CourseHero({
  course,
  lessonCount,
  heroVideoUrl,
  isEnrolled,
  isSignedIn,
}: CourseHeroProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-white via-brand-cream/50 to-brand-warm shadow-[0_24px_80px_-40px_rgba(1,118,208,0.35)]">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{formatPrice(course.price)}</Badge>
            {course.level && (
              <Badge variant="outline" className="gap-1 border-brand-teal/20 text-brand-teal">
                <GraduationCap className="size-3" />
                {course.level}
              </Badge>
            )}
            {isEnrolled && (
              <Badge variant="default" className="gap-1 bg-brand-teal">
                <CheckCircle2 className="size-3" />
                Enrolled
              </Badge>
            )}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-light tracking-tight text-brand-navy sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {course.title}
          </h1>

          {course.rating != null && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-gold/10 px-3 py-1.5">
                <span className="text-lg font-semibold text-brand-navy">
                  {course.rating.toFixed(1)}
                </span>
                <Star className="size-4 fill-brand-gold text-brand-gold" />
                {course.ratingCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({course.ratingCount} reviews)
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-6">
            {course.durationLabel && (
              <Stat icon={Clock} label="Duration" value={course.durationLabel} />
            )}
            <Stat
              icon={GraduationCap}
              label="Modules"
              value={String(course.modules.length)}
            />
            <Stat icon={Users} label="Enrolled" value={String(course.enrolledCount)} />
            <Stat icon={CheckCircle2} label="Lessons" value={String(lessonCount)} />
          </div>

          {course.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="muted" className="font-normal">
                  {tag}
                </Badge>
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
              className="border-brand-teal/20 hover:border-brand-teal/40 hover:bg-brand-teal/5"
              nativeButton={false}
              render={<Link href="/courses" />}
            >
              Back to catalog
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-brand-teal/10 shadow-lg">
          <CardContent className="p-0">
            <YouTubePlayer
              url={heroVideoUrl}
              title={course.title}
              className="rounded-none"
            />
          </CardContent>
        </Card>
      </div>

      {course.whatYouWillLearn.length > 0 && (
        <div className="border-t border-border/50 bg-brand-teal/[0.03] px-6 py-8 sm:px-8 lg:px-10">
          <h2 className="font-heading text-2xl font-light text-brand-navy">
            What I will learn?
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {course.whatYouWillLearn.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <CheckCircle2 className="size-3" />
                </span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-brand-navy">{value}</p>
      </div>
    </div>
  );
}
