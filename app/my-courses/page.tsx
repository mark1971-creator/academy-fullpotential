import { auth, currentUser } from "@clerk/nextjs/server";
import { BookOpen } from "lucide-react";
import Link from "next/link";

import { EnrolledCourses } from "@/components/dashboard/enrolled-courses";
import { PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { getUserEnrollments } from "@/lib/actions/enrollments";
import { syncCurrentUserProfile } from "@/lib/actions/users";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Learning",
  description: "Your enrolled programs at Full Potential Academy.",
};

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (user?.firstName) {
    return user.firstName;
  }

  const email = user?.primaryEmailAddress?.emailAddress;
  if (email) {
    return email.split("@")[0];
  }

  return "there";
}

export default async function MyCoursesPage() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const [user, enrollments] = await Promise.all([
    currentUser(),
    (async () => {
      await syncCurrentUserProfile();
      return getUserEnrollments();
    })(),
  ]);

  const displayName = getDisplayName(user);
  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <PageShell>
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
          BEING at Full Potential
        </p>
        <h1 className="mt-4 font-heading text-4xl font-light tracking-tight sm:text-5xl">
          My Learning
        </h1>
        <p className="mt-5 text-lg text-brand-warm">
          Welcome back,{" "}
          <span className="font-medium text-foreground">{displayName}</span>
          {email ? <span className="text-brand-warm"> — {email}</span> : null}
        </p>
      </header>

      <section className="mt-14 academy-card-elevated p-8 sm:p-10 lg:mt-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
              <BookOpen className="size-6" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
                Your enrolled programs
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-brand-warm-soft">
                Continue where you left off in each certification or training program.
              </p>
            </div>
          </div>
          <Button
            className="shrink-0"
            variant="gold"
            size="default"
            nativeButton={false}
            render={<Link href="/courses" />}
          >
            Browse programs
          </Button>
        </div>

        <EnrolledCourses enrollments={enrollments} />
      </section>
    </PageShell>
  );
}
