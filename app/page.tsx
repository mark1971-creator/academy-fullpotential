import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { HomeHeroActions } from "@/components/home-hero-actions";
import { GraduatesTestimonials } from "@/components/testimonials/graduates-testimonials";
import { Button } from "@/components/ui/button";
import { getCourseBySlug } from "@/lib/actions/courses";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";

export default async function HomePage() {
  const hpccCourse = await getCourseBySlug("human-potential-coach-certification");
  const graduateTestimonials =
    hpccCourse?.testimonials.length ? hpccCourse.testimonials : HPCC_TESTIMONIALS;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-dark via-brand-navy-mid to-brand-navy" />
        <div className="absolute inset-0 bg-brand-navy-dark/20 pointer-events-none" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:py-32">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold">
            Human Potential Academy
          </p>
          <h1 className="mt-6 max-w-4xl text-balance font-heading text-5xl font-light leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            When the Being comes alive, the Doing thrives
          </h1>
          <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-white/90 sm:text-xl sm:text-white/85">
            A place to learn and grow into your full potential. Explore certifications,
            trainings, and programs that elevate your state of BEING.
          </p>
          <Suspense
            fallback={
              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <div className="h-11 w-44 animate-pulse rounded-sm bg-white/10" />
                <div className="h-11 w-40 animate-pulse rounded-sm bg-white/10" />
              </div>
            }
          >
            <HomeHeroActions />
          </Suspense>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-800">
              Our vision
            </p>
            <h2 className="mt-4 font-heading text-4xl font-light text-brand-blue sm:text-5xl">
              Every Human, BEING at Full Potential
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              We specialize in Human Potential development to enable breakthroughs in
              engagement, innovation, and meaningful contribution — making it easier to
              take action from a deeper place of awareness.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <GraduatesTestimonials
            testimonials={graduateTestimonials}
            className=""
            titleClassName="text-brand-blue"
            variant="light"
          />
        </div>
      </section>

      <section className="bg-brand-navy-dark">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            Begin your journey
          </p>
          <h2 className="mt-4 font-heading text-4xl font-light text-white sm:text-5xl">
            Certification &amp; Training Programs
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Whether you are a coach, leader, manager, or change agent — we support you
            in realizing your full human potential.
          </p>
          <Button
            className="mt-10"
            size="lg"
            variant="gold"
            nativeButton={false}
            render={<Link href="/courses" />}
          >
            View all programs
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
