import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { CourseHero } from "@/components/course/CourseHero";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { PageShell } from "@/components/ui/brand-elements";
import { getCourseWithCurriculumBySlug } from "@/lib/actions/courses";
import {
  getCourseItemProgress,
  isUserEnrolledInCourse,
} from "@/lib/actions/enrollments";
import { getHeroVideoUrl } from "@/lib/courses/utils";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseWithCurriculumBySlug(slug);

  if (!course) {
    return { title: "Program not found" };
  }

  return {
    title: course.title,
    description: course.description ?? `Explore ${course.title} at Full Potential Academy.`,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseWithCurriculumBySlug(slug);

  if (!course) {
    notFound();
  }

  const { userId } = await auth();
  const [isEnrolled, progress] = await Promise.all([
    isUserEnrolledInCourse(course.id),
    getCourseItemProgress(course),
  ]);

  const lessonCount = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  const heroVideoUrl = getHeroVideoUrl(course);

  return (
    <PageShell className="max-w-[1400px]">
      <CourseHero
        course={course}
        lessonCount={lessonCount}
        heroVideoUrl={heroVideoUrl}
        isEnrolled={isEnrolled}
        isSignedIn={Boolean(userId)}
      />

      <section className="mt-10 lg:mt-14">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-light text-brand-navy sm:text-3xl">
            Start learning
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Work through each module at your own pace. Your progress is saved as you
            complete lessons.
          </p>
        </div>
        <CoursePlayer course={course} progress={progress} isEnrolled={isEnrolled} />
      </section>
    </PageShell>
  );
}
