export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  console.log("📄 CourseDetailPage rendered for slug:", slug);

  let course;
  try {
    course = await getCourseWithCurriculumBySlug(slug);
    console.log("✅ Course loaded:", course ? "Yes" : "No", course?.title);
  } catch (err: any) {
    console.error("🔴 Error in getCourseWithCurriculumBySlug:", err);
    course = null;
  }

  if (!course) {
    console.warn("❌ No course data - showing notFound");
    notFound();
  }

  // ... rest of the function stays the same
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