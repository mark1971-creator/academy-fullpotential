import { auth, currentUser } from "@clerk/nextjs/server";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandCard, PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
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

  const user = await currentUser();
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
                Your enrolled courses will appear here with progress tracking and quick
                access to your next lesson.
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

        <div className="mt-8 rounded-sm border border-dashed border-border/80 bg-brand-warm/40 px-6 py-12 text-center">
          <p className="font-heading text-xl font-light text-foreground/80">
            Your enrolled courses will appear here
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Explore certification and training programs to begin your Human Potential
            journey.
          </p>
        </div>
      </BrandCard>
    </PageShell>
  );
}
