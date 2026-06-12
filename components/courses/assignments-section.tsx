import { Download, FileText } from "lucide-react";

import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { getAllAssignments } from "@/lib/courses/utils";
import type { Assignment, CourseWithCurriculum } from "@/types/lms";

type AssignmentsSectionProps = {
  course: CourseWithCurriculum;
};

const FILE_TYPE_LABELS: Record<Assignment["fileType"], string> = {
  pdf: "PDF",
  doc: "Word Document",
  docx: "Word Document",
};

export function AssignmentsSection({ course }: AssignmentsSectionProps) {
  const assignments = getAllAssignments(course);

  return (
    <section className="mt-16">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-brand-gold">
        Resources
      </p>
      <h2 className="mt-3 font-heading text-3xl font-light">Assignments &amp; Downloads</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Supplemental materials for each module and lesson. Enrolled students can download
        these files to complete guided exercises offline.
      </p>

      {assignments.length === 0 ? (
        <BrandCard className="mt-8 border-dashed">
          <FileText className="size-8 text-brand-gold" strokeWidth={1.25} />
          <h3 className="mt-4 font-heading text-xl font-light">Assignments coming soon</h3>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            PDF and Word document assignments will appear here once uploaded to Supabase
            Storage and linked to modules or lessons.
          </p>
        </BrandCard>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {assignments.map((assignment) => (
            <li key={assignment.id}>
              <BrandCard className="flex h-full flex-col p-6">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 size-5 shrink-0 text-brand-gold" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-lg font-light">{assignment.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {FILE_TYPE_LABELS[assignment.fileType]}
                    </p>
                    {assignment.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-6 w-full border-brand-navy/20"
                  nativeButton={false}
                  render={
                    <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <Download className="size-4" />
                  Download
                </Button>
              </BrandCard>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
