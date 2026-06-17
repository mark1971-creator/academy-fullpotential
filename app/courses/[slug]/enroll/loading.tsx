import { PageShell } from "@/components/ui/brand-elements";

export default function CourseEnrollLoading() {
  return (
    <PageShell className="max-w-lg text-center">
      <div className="mx-auto mt-20 animate-pulse space-y-4">
        <div className="mx-auto h-10 w-10 rounded-full bg-brand-gold/20" />
        <div className="mx-auto h-6 w-48 rounded bg-muted" />
        <div className="mx-auto h-4 w-64 rounded bg-muted" />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Preparing your enrollment…</p>
    </PageShell>
  );
}
