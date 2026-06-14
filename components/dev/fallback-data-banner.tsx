import { TriangleAlert } from "lucide-react";

/**
 * Development-only notice shown when a page is rendering local fallback fixture
 * data because Supabase could not be reached. Render this conditionally based on
 * `isFixtureData(...)` from `@/lib/courses/fixtures`.
 */
export function FallbackDataBanner() {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
      <div className="text-sm">
        <p className="font-medium">Using local fallback data — Supabase connection issue</p>
        <p className="mt-0.5 text-amber-800/80">
          This content comes from local development fixtures. Verify
          {" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.8em]">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and your API keys to load live data.
        </p>
      </div>
    </div>
  );
}
