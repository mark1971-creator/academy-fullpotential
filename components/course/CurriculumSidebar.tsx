"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  FileText,
  ListVideo,
  Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getYoutubeThumbnail } from "@/lib/courses/youtube";
import { formatLessonDuration, isItemComplete } from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type {
  Assignment,
  CourseWithCurriculum,
  ItemProgressState,
  Lesson,
  ModuleWithLessons,
} from "@/types/lms";

export type SelectedCurriculumItem =
  | { type: "lesson"; id: string }
  | { type: "assignment"; id: string };

type CurriculumSidebarProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  selected: SelectedCurriculumItem | null;
  onSelect: (item: SelectedCurriculumItem) => void;
  className?: string;
};

export function CurriculumSidebar({
  course,
  progress,
  selected,
  onSelect,
  className,
}: CurriculumSidebarProps) {
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalAssignments = course.modules.reduce((n, m) => n + m.assignments.length, 0);

  return (
    <aside className={cn("academy-sidebar-panel overflow-hidden", className)}>
      <div className="border-b border-sidebar-border bg-sidebar-accent/50 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <ListVideo className="size-5 text-brand-teal" />
          <h2 className="font-heading text-lg font-light text-foreground">Course curriculum</h2>
        </div>
        <p className="mt-2 text-sm text-brand-warm">
          {course.modules.length} modules · {totalLessons} lessons
          {totalAssignments > 0 ? ` · ${totalAssignments} assignments` : ""}
        </p>
      </div>

      <div className="divide-y divide-sidebar-border">
        {course.modules.map((module, moduleIndex) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            moduleIndex={moduleIndex}
            progress={progress}
            selected={selected}
            onSelect={onSelect}
            defaultOpen={moduleIndex === 0}
          />
        ))}
      </div>
    </aside>
  );
}

type ModuleAccordionProps = {
  module: ModuleWithLessons;
  moduleIndex: number;
  progress: ItemProgressState;
  selected: SelectedCurriculumItem | null;
  onSelect: (item: SelectedCurriculumItem) => void;
  defaultOpen?: boolean;
};

function ModuleAccordion({
  module,
  moduleIndex,
  progress,
  selected,
  onSelect,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const lessonComplete = module.lessons.filter((lesson) =>
    isItemComplete("lesson", lesson.id, progress),
  ).length;
  const assignmentComplete = module.assignments.filter((assignment) =>
    isItemComplete("assignment", assignment.id, progress),
  ).length;
  const totalItems = module.lessons.length + module.assignments.length;
  const completedCount = lessonComplete + assignmentComplete;

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-5 py-4 transition-colors hover:bg-sidebar-accent/40 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">
            Module {moduleIndex + 1}
          </p>
          <p className="mt-1.5 text-sm font-medium leading-snug text-foreground">
            {module.title.replace(/^Module \d+:\s*/i, "")}
          </p>
          <p className="mt-1.5 text-xs text-brand-warm">
            {completedCount}/{totalItems} complete
          </p>
        </div>
        <ChevronDown className="mt-1 size-4 shrink-0 text-brand-warm transition-transform group-open:rotate-180" />
      </summary>

      <ul className="space-y-1.5 border-t border-sidebar-border bg-brand-charcoal/25 px-3 py-3">
        {module.lessons.map((lesson, lessonIndex) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            lessonIndex={lessonIndex}
            isSelected={selected?.type === "lesson" && selected.id === lesson.id}
            isComplete={isItemComplete("lesson", lesson.id, progress)}
            onSelect={() => onSelect({ type: "lesson", id: lesson.id })}
          />
        ))}
        {module.assignments.map((assignment) => (
          <AssignmentRow
            key={assignment.id}
            assignment={assignment}
            isSelected={
              selected?.type === "assignment" && selected.id === assignment.id
            }
            isComplete={isItemComplete("assignment", assignment.id, progress)}
            onSelect={() => onSelect({ type: "assignment", id: assignment.id })}
          />
        ))}
      </ul>
    </details>
  );
}

type LessonRowProps = {
  lesson: Lesson;
  lessonIndex: number;
  isSelected: boolean;
  isComplete: boolean;
  onSelect: () => void;
};

function LessonRow({
  lesson,
  lessonIndex,
  isSelected,
  isComplete,
  onSelect,
}: LessonRowProps) {
  const isVideo = lesson.lessonType === "video";
  const thumbnail = isVideo ? getYoutubeThumbnail(lesson.youtubeUrl) : null;
  const duration = formatLessonDuration(lesson);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-all",
          isSelected
            ? "bg-brand-teal/15 ring-1 ring-brand-teal/40"
            : "hover:bg-sidebar-accent/50",
        )}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-brand-charcoal">
          {isVideo && thumbnail ? (
            <>
              <Image
                src={thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="flex size-7 items-center justify-center rounded-full bg-white/95 text-brand-teal shadow-sm">
                  <Play className="size-3.5 fill-brand-teal" />
                </span>
              </span>
              {duration && (
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                  {duration}
                </span>
              )}
            </>
          ) : (
            <span className="flex size-full items-center justify-center text-brand-teal">
              <FileText className="size-6" strokeWidth={1.5} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant="outline"
              className="mb-1 h-5 border-brand-teal/30 px-1.5 text-[10px] font-normal text-brand-teal"
            >
              {isVideo ? `Part ${lessonIndex + 1}` : "Resource"}
            </Badge>
            {isComplete ? (
              <CheckCircle2 className="size-4 shrink-0 text-brand-gold" />
            ) : (
              <Circle className="size-4 shrink-0 text-sidebar-border" />
            )}
          </div>
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {lesson.title}
          </p>
        </div>
      </button>
    </li>
  );
}

type AssignmentRowProps = {
  assignment: Assignment;
  isSelected: boolean;
  isComplete: boolean;
  onSelect: () => void;
};

function AssignmentRow({
  assignment,
  isSelected,
  isComplete,
  onSelect,
}: AssignmentRowProps) {
  const hasFiles =
    Boolean(assignment.fileUrl) || assignment.resourceFiles.length > 0;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-all",
          isSelected
            ? "bg-brand-gold/12 ring-1 ring-brand-gold/35"
            : "hover:bg-sidebar-accent/50",
        )}
      >
        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-brand-gold/12 text-brand-gold">
          <ClipboardList className="size-6" strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant="outline"
              className="mb-1 h-5 border-brand-gold/35 px-1.5 text-[10px] font-normal text-brand-gold"
            >
              Assignment{hasFiles ? "" : " · instructions"}
            </Badge>
            {isComplete ? (
              <CheckCircle2 className="size-4 shrink-0 text-brand-gold" />
            ) : (
              <Circle className="size-4 shrink-0 text-sidebar-border" />
            )}
          </div>
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {assignment.title}
          </p>
        </div>
      </button>
    </li>
  );
}
