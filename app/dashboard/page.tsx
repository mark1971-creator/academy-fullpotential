import { auth, currentUser } from "@clerk/nextjs/server";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EnrolledCourses } from "@/components/dashboard/enrolled-courses";
import { BrandCard, PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { getUserEnrollments } from "@/lib/actions/enrollments";
import { syncCurrentUserProfile } from "@/lib/actions/users";
import { AUTH_ROUTES } from "@/lib/clerk/routes";

export const dynamic = "force-dynamic";

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

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect(AUTH_ROUTES.signIn);
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
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">
          BEING at Full Potential
        </p>
        <h1 className="mt-3 font-heading text-4xl font-light tracking-tight sm:text-5xl">
          Your Academy Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome,{" "}
          <span className="font-medium text-foreground">{displayName}</span>
          {email ? (
            <span className="text-muted-foreground"> — {email}</span>
          ) : null}
        </p>
      </div>

      <BrandCard className="mt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-brand-gold/15 text-brand-gold">
              <BookOpen className="size-5" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-heading text-2xl font-light">Your Enrolled Courses</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Track your progress and pick up where you left off in each program.
              </p>
            </div>
          </div>
          <Button
            className="shrink-0"
            variant="gold"
            size="sm"
            nativeButton={false}
            render={<Link href="/courses" />}
          >
            Browse programs
          </Button>
        </div>

        <EnrolledCourses enrollments={enrollments} />
      </BrandCard>
    </PageShell>
  );
}
