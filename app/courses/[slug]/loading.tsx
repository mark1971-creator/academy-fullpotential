import { PageShell } from "@/components/ui/brand-elements";

export default function CourseDetailLoading() {
  return (
    <PageShell>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-12 w-4/5 rounded bg-muted" />
          <div className="h-5 w-full max-w-xl rounded bg-muted" />
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="mt-4 flex gap-3">
            <div className="h-11 w-40 rounded bg-muted" />
            <div className="h-11 w-36 rounded bg-muted" />
          </div>
        </div>
        <div className="aspect-[4/3] animate-pulse rounded-sm bg-muted" />
      </div>
      <div className="mt-16 space-y-6 border-t border-border/70 pt-16">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-sm bg-muted/70" />
          <div className="aspect-video animate-pulse rounded-sm bg-muted" />
        </div>
      </div>
    </PageShell>
  );
}
