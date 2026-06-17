import { PageShell } from "@/components/ui/brand-elements";

export default function MyCoursesLoading() {
  return (
    <PageShell>
      <div className="max-w-3xl animate-pulse space-y-4">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="h-12 w-2/3 rounded bg-muted" />
        <div className="h-5 w-1/2 rounded bg-muted" />
      </div>
      <div className="mt-12 h-64 animate-pulse rounded-sm bg-muted/70" />
    </PageShell>
  );
}
