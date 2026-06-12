import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AssignmentsSection } from "@/components/courses/assignments-section";
import { CourseCurriculum } from "@/components/courses/course-curriculum";
import { BrandCard, PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { getCourseWithCurriculumBySlug } from "@/lib/actions/courses";
import { formatPrice } from "@/lib/courses/utils";

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

  const lessonCount = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return (
    <PageShell>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
            {formatPrice(course.price)}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-light tracking-tight sm:text-5xl">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {course.description ?? "A transformational learning experience."}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>
              {course.modules.length} module{course.modules.length === 1 ? "" : "s"}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Enroll — coming soon</Button>
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

        {course.thumbnailUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
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
          <BrandCard className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-brand-navy/5 to-brand-gold/10">
            <BookOpen className="size-14 text-brand-navy/35" strokeWidth={1.1} />
          </BrandCard>
        )}
      </div>

      <section className="mt-16 border-t border-border/70 pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
          Curriculum
        </p>
        <h2 className="mt-3 font-heading text-3xl font-light">What you&apos;ll learn</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Browse modules and lessons below. Select any lesson to preview its embedded YouTube
          video.
        </p>
        <div className="mt-10">
          <CourseCurriculum course={course} />
        </div>
      </section>

      <AssignmentsSection course={course} />
    </PageShell>
  );
}
