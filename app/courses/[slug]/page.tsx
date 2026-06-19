import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { CoursePreviewLayout } from "@/components/course-preview/course-preview";
import { EnrollStatusBanner } from "@/components/course-preview/enroll-status-banner";
import { FallbackDataBanner } from "@/components/dev/fallback-data-banner";
import { PageShell } from "@/components/ui/brand-elements";
import { getCoursePreviewBySlug } from "@/lib/actions/courses";
import { isUserEnrolledInCourse } from "@/lib/actions/enrollments";
import { isFixtureData } from "@/lib/courses/fixtures";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";
import { getHeroVideoUrl, getPreviewLessonCount } from "@/lib/courses/utils";

type CoursePreviewPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ payment?: string; enroll_error?: string }>;
};

export async function generateMetadata({ params }: CoursePreviewPageProps) {
  const { slug } = await params;
  const course = await getCoursePreviewBySlug(slug);

  if (!course) {
    return { title: "Program not found" };
  }

  return {
    title: course.title,
    description:
      course.tagline ??
      course.description ??
      `Explore ${course.title} at Full Potential Academy.`,
  };
}

export default async function CoursePreviewPage({
  params,
  searchParams,
}: CoursePreviewPageProps) {
  const { slug } = await params;
  const { payment, enroll_error: enrollError } = await searchParams;

  const course = await getCoursePreviewBySlug(slug);

  if (!course) {
    notFound();
  }

  const { userId } = await auth().catch(() => ({ userId: null as string | null }));

  const isEnrolled = userId
    ? await isUserEnrolledInCourse(course.id).catch(() => false)
    : false;

  const lessonCount = getPreviewLessonCount(course);
  const heroVideoUrl = getHeroVideoUrl(course);
  const usingFallbackData = isFixtureData(course);
  const testimonials =
    course.slug === "human-potential-coach-certification" &&
    course.testimonials.length === 0
      ? HPCC_TESTIMONIALS
      : course.testimonials;

  return (
    <PageShell className="max-w-[1400px]">
      {process.env.NODE_ENV === "development" && usingFallbackData && (
        <FallbackDataBanner />
      )}

      <EnrollStatusBanner payment={payment} enrollError={enrollError} />

      <CoursePreviewLayout
        course={{ ...course, testimonials }}
        lessonCount={lessonCount}
        heroVideoUrl={heroVideoUrl}
        isEnrolled={isEnrolled}
      />
    </PageShell>
  );
}
