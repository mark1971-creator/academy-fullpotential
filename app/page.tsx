import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Compass, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { HomeHeroActions } from "@/components/home-hero-actions";
import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { DASHBOARD_URL } from "@/lib/clerk/routes";

const highlights = [
  {
    icon: GraduationCap,
    title: "Certification programs",
    description:
      "ICF-approved pathways and immersive modules designed to unlock and amplify human potential.",
  },
  {
    icon: Compass,
    title: "Transformational learning",
    description:
      "Move from information to inner development — cultivating the state of BEING from which meaningful action flows.",
  },
  {
    icon: Sparkles,
    title: "Global coaching community",
    description:
      "Join coaches and change agents worldwide using proven Human Potential tools and methodologies.",
  },
] as const;

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect(DASHBOARD_URL);
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy-dark via-brand-navy-mid to-brand-navy" />
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center lg:py-32">
          <p className="font-sans text-xs uppercase tracking-[0.32em] text-brand-gold-light">
            Human Potential Academy
          </p>
          <h1 className="mt-6 max-w-4xl text-balance font-heading text-5xl font-light leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            When the Being comes alive, the Doing thrives
          </h1>
          <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-white/70">
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

      <section className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Our vision</p>
            <h2 className="mt-4 font-heading text-4xl font-light text-foreground sm:text-5xl">
              Every Human, BEING at Full Potential
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We specialize in Human Potential development to enable breakthroughs in
              engagement, innovation, and meaningful contribution — making it easier to
              take action from a deeper place of awareness.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-warm/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <BrandCard key={title} className="h-full">
                <span className="flex size-12 items-center justify-center rounded-sm bg-brand-navy/5 text-brand-navy">
                  <Icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-heading text-2xl font-light">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </BrandCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-24">
          <p className="text-xs uppercase tracking-[0.28em] text-brand-gold-light">
            Begin your journey
          </p>
          <h2 className="mt-4 font-heading text-4xl font-light text-white sm:text-5xl">
            Certification &amp; Training Programs
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/70">
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
