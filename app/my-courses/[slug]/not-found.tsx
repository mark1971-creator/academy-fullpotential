import Link from "next/link";

import { PageShell } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";

export default function CourseLearnNotFound() {
  return (
    <PageShell className="max-w-xl text-center">
      <h1 className="font-heading text-3xl font-light text-brand-navy">Program not found</h1>
      <p className="mt-4 text-muted-foreground">
        This program is not available in your learning area, or the link may be incorrect.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button variant="gold" nativeButton={false} render={<Link href="/my-courses" />}>
          My learning
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/courses" />}>
          Browse programs
        </Button>
      </div>
    </PageShell>
  );
}
