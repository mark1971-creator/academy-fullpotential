import { CheckCircle2, Download, FileText, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Assignment, AssignmentFileType } from "@/types/lms";

const FILE_TYPE_LABELS: Record<AssignmentFileType, string> = {
  pdf: "PDF",
  doc: "Word document",
  docx: "Word document",
};

type AssignmentContentProps = {
  assignment: Assignment;
  isEnrolled: boolean;
  isComplete: boolean;
  isPending: boolean;
  onMarkComplete: () => void;
};

function DownloadLink({
  href,
  label,
  fileType,
}: {
  href: string;
  label: string;
  fileType: AssignmentFileType;
}) {
  return (
    <Button
      variant="outline"
      className="w-full justify-start border-white/15 bg-white/5 text-foreground hover:border-brand-gold/50 hover:bg-brand-gold/12 sm:w-auto"
      nativeButton={false}
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      <Download className="size-4 shrink-0" />
      <span className="truncate">
        {label} ({FILE_TYPE_LABELS[fileType]})
      </span>
    </Button>
  );
}

export function AssignmentContent({
  assignment,
  isEnrolled,
  isComplete,
  isPending,
  onMarkComplete,
}: AssignmentContentProps) {
  const downloads = [
    ...(assignment.fileUrl && assignment.fileType
      ? [
          {
            title: assignment.title,
            fileUrl: assignment.fileUrl,
            fileType: assignment.fileType,
          },
        ]
      : []),
    ...assignment.resourceFiles,
  ];

  return (
    <article className="academy-learn-surface overflow-hidden">
      <header className="border-b border-border px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
              Module assignment
            </p>
            <h2 className="mt-4 font-heading text-2xl font-light text-foreground sm:text-3xl">
              {assignment.title}
            </h2>
            {assignment.description && (
              <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-relaxed text-brand-warm">
                {assignment.description}
              </p>
            )}
          </div>

          {isEnrolled && (
            <Button
              variant={isComplete ? "outline" : "gold"}
              size="lg"
              className={cn(
                "shrink-0 uppercase tracking-[0.12em]",
                !isComplete && "min-w-[11rem] shadow-[0_8px_28px_-8px_rgb(250_204_21_/_0.55)]",
              )}
              disabled={isComplete || isPending}
              onClick={onMarkComplete}
            >
              {isComplete ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Completed
                </>
              ) : (
                "Mark as complete"
              )}
            </Button>
          )}
        </div>
      </header>

      <div className="px-6 py-8 sm:px-8 sm:py-10">
        {downloads.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Downloads</p>
            <div className="flex flex-col gap-3">
              {downloads.map((file) => (
                <DownloadLink
                  key={`${file.fileUrl}-${file.title}`}
                  href={file.fileUrl}
                  label={file.title}
                  fileType={file.fileType}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-5 rounded-xl border border-dashed border-border/80 bg-brand-charcoal/20 px-5 py-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-teal/15 text-brand-teal">
              <FolderOpen className="size-6" />
            </span>
            <div>
              <p className="font-medium text-foreground">Worksheets &amp; documents</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-warm">
                PDF and Word resources for this module will appear here once uploaded.
                Follow the instructions above to complete the assignment in the meantime.
              </p>
            </div>
          </div>
        )}

        {downloads.length > 0 && (
          <div className="mt-8 flex items-start gap-4 rounded-xl border border-border/60 bg-brand-surface/30 px-5 py-4">
            <FileText className="mt-0.5 size-5 shrink-0 text-brand-gold" />
            <p className="text-sm leading-relaxed text-brand-warm">
              Download the materials, complete the exercises described in the instructions,
              and mark this assignment complete when you are done.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
