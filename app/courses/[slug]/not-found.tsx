import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/ui/brand-elements";

export default function CourseNotFound() {
  return (
    <PageShell className="flex flex-col items-center justify-center text-center">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
        Program not found
      </p>
      <h1 className="mt-3 font-heading text-4xl font-light">This course isn&apos;t available</h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        The program you&apos;re looking for may be unpublished or the link may be incorrect.
      </p>
      <Button className="mt-8" nativeButton={false} render={<Link href="/courses" />}>
        Browse all programs
      </Button>
    </PageShell>
  );
}
