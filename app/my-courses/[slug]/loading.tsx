import { PageShell } from "@/components/ui/brand-elements";

export default function CourseLearnLoading() {
  return (
    <PageShell className="max-w-[1400px]">
      <div className="mb-8 h-9 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-8 space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-8 h-20 animate-pulse rounded-xl bg-muted/70" />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="h-96 animate-pulse rounded-lg bg-muted/70" />
        <div className="aspect-video animate-pulse rounded-lg bg-muted" />
      </div>
    </PageShell>
  );
}
