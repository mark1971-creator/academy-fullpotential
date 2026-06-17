import { BookOpen } from "lucide-react";

import { BrandCard } from "@/components/ui/brand-elements";
import type { ModulePreview } from "@/types/lms";

type CurriculumOverviewProps = {
  modules: ModulePreview[];
};

export function CurriculumOverview({ modules }: CurriculumOverviewProps) {
  if (modules.length === 0) return null;

  const totalLessons = modules.reduce((sum, module) => sum + module.lessonCount, 0);

  return (
    <section>
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
          <BookOpen className="size-5" />
        </span>
        <div>
          <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
            Curriculum overview
          </h2>
          <p className="mt-1.5 text-sm text-brand-warm">
            {modules.length} modules
            {totalLessons > 0 ? ` · ${totalLessons} lessons` : ""} — enroll for full access
          </p>
        </div>
      </div>

      <ol className="mt-10 space-y-3">
        {modules.map((module, index) => (
          <li key={module.id}>
            <BrandCard className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-brand-teal/30 sm:p-6">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-teal/15 text-sm font-semibold text-brand-teal">
                  {index + 1}
                </span>
                <p className="font-medium text-foreground">{module.title}</p>
              </div>
              {module.lessonCount > 0 && (
                <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-brand-warm">
                  {module.lessonCount} {module.lessonCount === 1 ? "lesson" : "lessons"}
                </span>
              )}
            </BrandCard>
          </li>
        ))}
      </ol>
    </section>
  );
}
