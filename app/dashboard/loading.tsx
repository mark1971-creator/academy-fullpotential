import { PageShell } from "@/components/ui/brand-elements";

export default function DashboardLoading() {
  return (
    <PageShell>
      <div className="max-w-3xl animate-pulse space-y-4">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-10 w-2/3 rounded bg-muted" />
        <div className="h-6 w-1/2 rounded bg-muted" />
      </div>
      <div className="mt-12 h-64 animate-pulse rounded-sm bg-muted/60" />
    </PageShell>
  );
}
