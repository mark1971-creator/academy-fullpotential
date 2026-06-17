import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ContentComingSoonBanner } from "@/components/course-learn/content-coming-soon-banner";
import { PaymentSuccessBanner } from "@/components/course-learn/payment-success-banner";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { courseHasPlaceholderContent } from "@/lib/courses/placeholders";
import type { CourseWithCurriculum, ItemProgressState } from "@/types/lms";

type CourseLearnLayoutProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  paymentSuccess?: boolean;
};

export function CourseLearnLayout({
  course,
  progress,
  paymentSuccess = false,
}: CourseLearnLayoutProps) {
  const showPlaceholderBanner = courseHasPlaceholderContent(course);

  return (
    <PageShell className="max-w-[1440px]">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit gap-2 text-brand-warm hover:bg-white/5 hover:text-foreground"
          nativeButton={false}
          render={<Link href="/my-courses" />}
        >
          <ArrowLeft className="size-4" />
          My learning
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-brand-teal/35 hover:border-brand-teal hover:text-brand-teal"
          nativeButton={false}
          render={<Link href={`/courses/${course.slug}`} />}
        >
          Course overview
        </Button>
      </div>

      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
          Now learning
        </p>
        <h1 className="mt-3 font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem]">
          {course.title}
        </h1>
      </div>

      {showPlaceholderBanner && (
        <div className="mb-10">
          <ContentComingSoonBanner />
        </div>
      )}

      <PaymentSuccessBanner show={paymentSuccess} />

      <section>
        <div className="mb-8">
          <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
            Your program
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-warm">
            Work through each module at your own pace. Your progress is saved as you
            complete lessons.
          </p>
        </div>
        <CoursePlayer course={course} progress={progress} isEnrolled />
      </section>
    </PageShell>
  );
}
