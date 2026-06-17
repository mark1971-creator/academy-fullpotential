import { PageShell } from "@/components/ui/brand-elements";

export default function CoursePreviewLoading() {
  return (
    <PageShell className="max-w-[1400px]">
      <div className="animate-pulse overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-6 w-24 rounded bg-muted" />
            <div className="h-12 w-4/5 rounded bg-muted" />
            <div className="h-5 w-full max-w-xl rounded bg-muted" />
            <div className="mt-6 flex gap-4">
              <div className="h-10 w-28 rounded bg-muted" />
              <div className="h-10 w-28 rounded bg-muted" />
            </div>
            <div className="mt-8 h-12 w-48 rounded bg-muted" />
          </div>
          <div className="aspect-video rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mt-16 space-y-4">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 rounded bg-muted/70" />
          <div className="h-24 rounded bg-muted/70" />
        </div>
      </div>
    </PageShell>
  );
}
