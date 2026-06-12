import { PageShell } from "@/components/ui/brand-elements";

export default function CoursesLoading() {
  return (
    <PageShell>
      <div className="max-w-3xl animate-pulse space-y-4">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-10 w-2/3 rounded bg-muted" />
        <div className="h-5 w-full max-w-xl rounded bg-muted" />
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-sm border border-border/80 bg-card"
          >
            <div className="aspect-[16/10] animate-pulse bg-muted" />
            <div className="space-y-3 p-8">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-7 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-10 w-full animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
