"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, ChevronDown, ListVideo } from "lucide-react";

import { AssignmentContent } from "@/components/course/AssignmentContent";
import {
  CurriculumSidebar,
  type SelectedCurriculumItem,
} from "@/components/course/CurriculumSidebar";
import { YouTubePlayer } from "@/components/courses/youtube-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { markCurriculumItemComplete } from "@/lib/actions/enrollments";
import {
  calculateProgressPercent,
  findAssignment,
  findLesson,
  formatLessonDuration,
  getFirstCurriculumItem,
  toSelectedCurriculumItem,
} from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type { CourseWithCurriculum, ItemProgressState } from "@/types/lms";

type CoursePlayerProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  isEnrolled: boolean;
};

export function CoursePlayer({ course, progress, isEnrolled }: CoursePlayerProps) {
  const firstItem = useMemo(() => toSelectedCurriculumItem(getFirstCurriculumItem(course)), [course]);
  const [selected, setSelected] = useState<SelectedCurriculumItem | null>(firstItem);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedLesson =
    selected?.type === "lesson" ? findLesson(course, selected.id) : null;
  const selectedAssignment =
    selected?.type === "assignment" ? findAssignment(course, selected.id) : null;

  const progressPercent = calculateProgressPercent(course, progress);
  const completedItems =
    progress.lessonIds.length + progress.assignmentIds.length + progress.quizIds.length;
  const totalItems = course.modules.reduce(
    (count, module) =>
      count +
      module.lessons.length +
      module.assignments.length +
      module.quizzes.length +
      module.lessons.reduce((n, l) => n + l.assignments.length + l.quizzes.length, 0),
    0,
  );

  function handleSelect(item: SelectedCurriculumItem) {
    setSelected(item);
    setMobileCurriculumOpen(false);
  }

  function handleMarkComplete(type: "lesson" | "assignment", id: string) {
    if (!isEnrolled) return;

    startTransition(async () => {
      await markCurriculumItemComplete(type, id, course.slug);
    });
  }

  const isLessonComplete =
    selectedLesson != null && progress.lessonIds.includes(selectedLesson.id);
  const isAssignmentComplete =
    selectedAssignment != null &&
    progress.assignmentIds.includes(selectedAssignment.id);

  return (
    <div className="space-y-8">
      <div className="academy-learn-surface p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-foreground">Your progress</p>
              {isEnrolled && totalItems > 0 && (
                <Badge className="border-transparent bg-brand-teal/20 font-medium text-brand-teal">
                  {completedItems} of {totalItems} items
                </Badge>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Progress
                value={progressPercent}
                className="h-3 flex-1 bg-muted/80"
                indicatorClassName="from-brand-teal to-brand-gold"
              />
              <span className="text-xl font-semibold tabular-nums text-brand-gold">
                {progressPercent}%
              </span>
            </div>
          </div>
          {!isEnrolled && (
            <p className="text-sm text-brand-warm">
              Enroll to track your progress through the certification.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-sidebar-border bg-brand-sidebar px-5 py-4 text-left shadow-sm lg:hidden"
        onClick={() => setMobileCurriculumOpen((open) => !open)}
      >
        <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
          <ListVideo className="size-4 text-brand-teal" />
          Browse curriculum
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-brand-warm transition-transform",
            mobileCurriculumOpen && "rotate-180",
          )}
        />
      </button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
        <div
          className={cn(
            "lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto",
            mobileCurriculumOpen ? "block" : "hidden lg:block",
          )}
        >
          <CurriculumSidebar
            course={course}
            progress={progress}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>

        <div className="min-w-0">
          {selectedLesson ? (
            <LessonContent
              lesson={selectedLesson}
              isEnrolled={isEnrolled}
              isComplete={isLessonComplete}
              isPending={isPending}
              onMarkComplete={() => handleMarkComplete("lesson", selectedLesson.id)}
            />
          ) : selectedAssignment ? (
            <AssignmentContent
              assignment={selectedAssignment}
              isEnrolled={isEnrolled}
              isComplete={isAssignmentComplete}
              isPending={isPending}
              onMarkComplete={() =>
                handleMarkComplete("assignment", selectedAssignment.id)
              }
            />
          ) : (
            <div className="academy-learn-surface flex flex-col items-center border-dashed py-20 text-center">
              <ListVideo className="size-10 text-brand-teal/60" />
              <p className="mt-4 text-base text-brand-warm">
                Select a lesson or assignment from the curriculum to begin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type LessonContentProps = {
  lesson: NonNullable<ReturnType<typeof findLesson>>;
  isEnrolled: boolean;
  isComplete: boolean;
  isPending: boolean;
  onMarkComplete: () => void;
};

function LessonContent({
  lesson,
  isEnrolled,
  isComplete,
  isPending,
  onMarkComplete,
}: LessonContentProps) {
  const isVideo = lesson.lessonType === "video";
  const duration = formatLessonDuration(lesson);

  return (
    <article className="academy-learn-surface overflow-hidden">
      <header className="border-b border-border px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <Badge
              variant={isVideo ? "default" : "outline"}
              className={cn(
                "mb-4",
                isVideo
                  ? "bg-brand-teal text-brand-charcoal"
                  : "border-brand-teal/40 text-brand-teal",
              )}
            >
              {isVideo ? "Video lesson" : "Resource"}
            </Badge>
            <h2 className="font-heading text-2xl font-light text-foreground sm:text-3xl">
              {lesson.title}
            </h2>
            {duration && (
              <p className="mt-3 text-sm text-brand-warm">Duration: {duration}</p>
            )}
          </div>

          {isEnrolled && (
            <Button
              variant={isComplete ? "outline" : "gold"}
              size="lg"
              className={cn(
                "w-full shrink-0 uppercase tracking-[0.12em] lg:w-auto",
                !isComplete && "lg:min-w-[11rem] shadow-[0_8px_28px_-8px_rgb(250_204_21_/_0.55)]",
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

      <div>
        {isVideo ? (
          <>
            {lesson.content && (
              <div className="border-b border-border px-6 py-7 sm:px-8 sm:py-8">
                <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-brand-warm">
                  {lesson.content}
                </p>
              </div>
            )}
            <YouTubePlayer
              url={lesson.youtubeUrl}
              title={lesson.title}
              className="rounded-none"
            />
          </>
        ) : (
          <div className="flex items-start gap-5 px-6 py-8 sm:px-8 sm:py-10">
            <p className="whitespace-pre-line text-base leading-relaxed text-brand-warm">
              {lesson.content ??
                "This resource is provided as part of your certification."}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
