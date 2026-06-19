import { notFound } from "next/navigation";

import { CourseLearnLayout } from "@/components/course-learn/course-learn-layout";
import { FallbackDataBanner } from "@/components/dev/fallback-data-banner";
import { getCourseWithCurriculumBySlug } from "@/lib/actions/courses";
import {
  getCourseItemProgress,
  requireEnrollmentForSlug,
} from "@/lib/actions/enrollments";
import { isFixtureData } from "@/lib/courses/fixtures";

type CourseLearnPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ payment?: string }>;
};

export async function generateMetadata({ params }: CourseLearnPageProps) {
  const { slug } = await params;
  const course = await getCourseWithCurriculumBySlug(slug);

  if (!course) {
    return { title: "Program not found" };
  }

  return {
    title: `${course.title} — Learn`,
    description: `Continue ${course.title} at Full Potential Academy.`,
  };
}

export default async function CourseLearnPage({
  params,
  searchParams,
}: CourseLearnPageProps) {
  const { slug } = await params;
  const { payment } = await searchParams;

  await requireEnrollmentForSlug(slug);

  const course = await getCourseWithCurriculumBySlug(slug);

  if (!course) {
    notFound();
  }

  const progress = await getCourseItemProgress(course).catch(() => ({
    lessonIds: [] as string[],
    assignmentIds: [] as string[],
    quizIds: [] as string[],
  }));

  const usingFallbackData = isFixtureData(course);

  return (
    <>
      {process.env.NODE_ENV === "development" && usingFallbackData && (
        <FallbackDataBanner />
      )}
      <CourseLearnLayout
        course={course}
        progress={progress}
        paymentSuccess={payment === "success"}
      />
    </>
  );
}
