import { BookOpen } from "lucide-react";

import { CatalogHero } from "@/components/catalog/catalog-hero";
import { CourseCard } from "@/components/catalog/course-card";
import { GraduatesTestimonials } from "@/components/testimonials/graduates-testimonials";
import { getCourseBySlug, getPublishedCourses } from "@/lib/actions/courses";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";
import { PageShell } from "@/components/ui/brand-elements";

export const metadata = {
  title: "Programs",
  description:
    "Browse certification and training programs from Being at Full Potential. Explore courses in human potential coaching, leadership, and organizational transformation.",
  alternates: {
    canonical: "https://academy.beingatfullpotential.com/courses",
  },
};

export default async function CoursesPage() {
  const [courses, hpccCourse] = await Promise.all([
    getPublishedCourses(),
    getCourseBySlug("human-potential-coach-certification"),
  ]);

  const graduateTestimonials =
    hpccCourse?.testimonials.length ? hpccCourse.testimonials : HPCC_TESTIMONIALS;

  return (
    <PageShell className="py-16 sm:py-20 lg:py-28">
      <CatalogHero
        title="Certification & Training Programs"
        description="Explore programs focused on human potential, coaching, and organizational transformation — designed to help you and your clients achieve breakthroughs."
      />

      {courses.length === 0 ? (
        <div className="academy-catalog-card mt-24 p-14 text-center">
          <BookOpen className="mx-auto size-12 text-brand-gold" strokeWidth={1.5} />
          <h2 className="mt-7 font-heading text-2xl font-light text-foreground">
            No programs published yet
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-warm-soft">
            Connect Supabase and run the migration + seed to load sample courses, or add
            programs in your database.
          </p>
        </div>
      ) : (
        <div className="mt-24 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <GraduatesTestimonials testimonials={graduateTestimonials} />
    </PageShell>
  );
}
