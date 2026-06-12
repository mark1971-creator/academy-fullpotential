import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getPublishedCourses } from "@/lib/actions/courses";
import { BrandCard, PageShell, SectionHeading } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";

function formatPrice(price: number) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <PageShell>
      <SectionHeading
        eyebrow="Academy"
        title="Certification & Training Programs"
        description="Explore programs focused on human potential, coaching, and organizational transformation — designed to help you and your clients achieve breakthroughs."
      />

      {courses.length === 0 ? (
        <BrandCard className="mt-12 text-center">
          <BookOpen className="mx-auto size-10 text-brand-gold" strokeWidth={1.5} />
          <h2 className="mt-5 font-heading text-2xl font-light">No programs published yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Connect Supabase and run the migration + seed to load sample courses, or add
            programs in your database.
          </p>
        </BrandCard>
      ) : (
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <BrandCard key={course.id} className="flex flex-col overflow-hidden p-0">
              {course.imageUrl ? (
                <div className="relative aspect-[16/10] bg-muted">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-navy/5 to-brand-gold/10">
                  <BookOpen className="size-10 text-brand-navy/40" strokeWidth={1.25} />
                </div>
              )}
              <div className="flex flex-1 flex-col p-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
                  {formatPrice(course.price)}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-light leading-snug">
                  {course.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
                <Button
                  variant="outline"
                  className="mt-8 w-full border-brand-navy/20 hover:border-brand-gold hover:bg-brand-gold/5 hover:text-brand-navy"
                  nativeButton={false}
                  render={<Link href={`/courses/${course.slug}`} />}
                >
                  View program
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </BrandCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
