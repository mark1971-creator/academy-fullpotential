import { CurriculumOverview } from "@/components/course-preview/curriculum-overview";
import { EnrollCta } from "@/components/course-preview/enroll-cta";
import { OutcomesSection } from "@/components/course-preview/outcomes-section";
import { PreviewHero } from "@/components/course-preview/preview-hero";
import { TestimonialsSection } from "@/components/course-preview/testimonials-section";
import { WhoThisIsFor } from "@/components/course-preview/who-this-is-for";
import { BrandCard } from "@/components/ui/brand-elements";
import { formatPrice } from "@/lib/courses/utils";
import type { CoursePreview } from "@/types/lms";

type CoursePreviewProps = {
  course: CoursePreview;
  lessonCount: number;
  heroVideoUrl: string | null;
  isEnrolled: boolean;
};

export function CoursePreviewLayout({
  course,
  lessonCount,
  heroVideoUrl,
  isEnrolled,
}: CoursePreviewProps) {
  return (
    <div className="space-y-16 lg:space-y-24">
      <PreviewHero
        course={course}
        lessonCount={lessonCount}
        heroVideoUrl={heroVideoUrl}
        isEnrolled={isEnrolled}
      />

      {course.description && course.tagline && (
        <section>
          <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
            About this program
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-brand-warm sm:text-lg">
            {course.description}
          </p>
        </section>
      )}

      <WhoThisIsFor items={course.whoThisIsFor} />
      <TestimonialsSection
        testimonials={course.testimonials}
        title="Student Reviews"
      />
      <CurriculumOverview modules={course.modules} />
      <OutcomesSection outcomes={course.whatYouWillLearn} />

      <section>
        <BrandCard className="border-brand-gold/25 bg-gradient-to-br from-brand-surface-elevated via-card to-brand-surface p-10 text-center sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Ready to begin?
          </p>
          <h2 className="mt-4 font-heading text-2xl font-light text-foreground sm:text-3xl">
            Enroll in {course.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-brand-warm">
            {isEnrolled
              ? "You are enrolled. Continue where you left off in the full program."
              : `Join ${course.enrolledCount > 0 ? `${course.enrolledCount}+ learners` : "learners"} — ${formatPrice(course.price)}`}
          </p>
          <div className="mt-10 flex justify-center">
            <EnrollCta
              courseSlug={course.slug}
              price={course.price}
              isEnrolled={isEnrolled}
            />
          </div>
        </BrandCard>
      </section>
    </div>
  );
}
