"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  Clock,
  Download,
  FileText,
  FolderOpen,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

import { YouTubePlayer } from "@/components/courses/youtube-player";
import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { markCurriculumItemComplete } from "@/lib/actions/enrollments";
import {
  findAssignment,
  findLesson,
  findQuiz,
  formatLessonDuration,
  getFirstCurriculumItem,
  getModuleCurriculumItems,
  isItemComplete,
} from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type {
  CourseWithCurriculum,
  CurriculumItem,
  CurriculumItemType,
  ItemProgressState,
} from "@/types/lms";

type CoursePlayerProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  isEnrolled: boolean;
};

type SelectedItem = {
  type: CurriculumItemType;
  id: string;
};

const ITEM_ICONS: Record<CurriculumItemType, typeof PlayCircle> = {
  lesson: PlayCircle,
  assignment: FileText,
  quiz: HelpCircle,
};

const ITEM_LABELS: Record<CurriculumItemType, string> = {
  lesson: "Part",
  assignment: "Assignment",
  quiz: "Quiz",
};

export function CoursePlayer({ course, progress, isEnrolled }: CoursePlayerProps) {
  const firstItem = useMemo(() => getFirstCurriculumItem(course), [course]);
  const [selected, setSelected] = useState<SelectedItem | null>(
    firstItem ? { type: firstItem.type, id: firstItem.id } : null,
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(course.modules.map((module) => module.id)),
  );
  const [isPending, startTransition] = useTransition();

  function toggleModule(moduleId: string) {
    setExpandedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  function handleMarkComplete(type: CurriculumItemType, id: string) {
    if (!isEnrolled) return;

    startTransition(async () => {
      await markCurriculumItemComplete(type, id, course.slug);
    });
  }

  if (course.modules.length === 0) {
    return (
      <BrandCard className="text-center">
        <p className="text-sm text-muted-foreground">
          Curriculum content is being prepared for this program.
        </p>
      </BrandCard>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
      <aside className="space-y-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
        <p className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
          Curriculum
        </p>
        {course.modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const items = getModuleCurriculumItems(module);
          const completedCount = items.filter((item) =>
            isItemComplete(item.type, item.id, progress),
          ).length;

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-sm border border-border/80 bg-card"
            >
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
                    Module {moduleIndex + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-light">{module.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {completedCount}/{items.length} complete
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              {isExpanded && (
                <ul className="border-t border-border/60">
                  {items.map((item) => (
                    <CurriculumSidebarItem
                      key={`${item.type}-${item.id}`}
                      item={item}
                      isSelected={selected?.type === item.type && selected.id === item.id}
                      isComplete={isItemComplete(item.type, item.id, progress)}
                      onSelect={() => setSelected({ type: item.type, id: item.id })}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </aside>

      <main className="min-w-0">
        {selected ? (
          <ContentPanel
            course={course}
            selected={selected}
            progress={progress}
            isEnrolled={isEnrolled}
            isPending={isPending}
            onMarkComplete={handleMarkComplete}
          />
        ) : (
          <BrandCard className="text-center">
            <PlayCircle className="mx-auto size-8 text-brand-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              Select a lesson, assignment, or quiz from the curriculum.
            </p>
          </BrandCard>
        )}
      </main>
    </div>
  );
}

type CurriculumSidebarItemProps = {
  item: CurriculumItem;
  isSelected: boolean;
  isComplete: boolean;
  onSelect: () => void;
};

function CurriculumSidebarItem({
  item,
  isSelected,
  isComplete,
  onSelect,
}: CurriculumSidebarItemProps) {
  const Icon =
    item.type === "lesson" && item.lessonType === "resource"
      ? FolderOpen
      : ITEM_ICONS[item.type];
  const itemLabel =
    item.type === "lesson" && item.lessonType === "resource" ? "Resource" : ITEM_LABELS[item.type];
  const duration =
    item.type === "lesson"
      ? formatLessonDuration({
          durationLabel: item.durationLabel ?? null,
          durationMinutes: item.durationMinutes ?? null,
        })
      : null;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
          isSelected ? "bg-brand-gold/8 text-foreground" : "hover:bg-muted/30",
        )}
      >
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0",
            isSelected ? "text-brand-gold" : "text-muted-foreground",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {itemLabel}
          </span>
          <span className="mt-0.5 block text-sm font-medium leading-snug">{item.title}</span>
          {(duration || item.questionCount != null) && (
            <span className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {duration}
                </span>
              )}
              {item.questionCount != null && item.questionCount > 0 && (
                <span>{item.questionCount} question{item.questionCount === 1 ? "" : "s"}</span>
              )}
            </span>
          )}
        </span>
        {isComplete ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-gold" />
        ) : (
          <Circle className="mt-0.5 size-4 shrink-0 text-border" />
        )}
      </button>
    </li>
  );
}

type ContentPanelProps = {
  course: CourseWithCurriculum;
  selected: SelectedItem;
  progress: ItemProgressState;
  isEnrolled: boolean;
  isPending: boolean;
  onMarkComplete: (type: CurriculumItemType, id: string) => void;
};

function ContentPanel({
  course,
  selected,
  progress,
  isEnrolled,
  isPending,
  onMarkComplete,
}: ContentPanelProps) {
  if (selected.type === "lesson") {
    const lesson = findLesson(course, selected.id);
    if (!lesson) return null;

    const isComplete = isItemComplete("lesson", lesson.id, progress);
    const eyebrow = lesson.lessonType === "resource" ? "Resource" : "Lesson";

    return (
      <div className="space-y-6">
        <ContentHeader
          eyebrow={eyebrow}
          title={lesson.title}
          description={lesson.content}
          isComplete={isComplete}
          isEnrolled={isEnrolled}
          isPending={isPending}
          onMarkComplete={() => onMarkComplete("lesson", lesson.id)}
        />
        {lesson.lessonType === "resource" ? (
          <BrandCard>
            <div className="flex items-start gap-4">
              <FolderOpen className="mt-0.5 size-6 shrink-0 text-brand-gold" />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {lesson.content ??
                    "Program resources for this section are provided to enrolled participants."}
                </p>
              </div>
            </div>
          </BrandCard>
        ) : (
          <YouTubePlayer url={lesson.youtubeUrl} title={lesson.title} />
        )}
      </div>
    );
  }

  if (selected.type === "assignment") {
    const assignment = findAssignment(course, selected.id);
    if (!assignment) return null;

    const isComplete = isItemComplete("assignment", assignment.id, progress);

    return (
      <div className="space-y-6">
        <ContentHeader
          eyebrow="Assignment"
          title={assignment.title}
          description={assignment.description}
          isComplete={isComplete}
          isEnrolled={isEnrolled}
          isPending={isPending}
          onMarkComplete={() => onMarkComplete("assignment", assignment.id)}
        />
        <BrandCard>
          <div className="flex items-start gap-4">
            <FileText className="mt-0.5 size-6 shrink-0 text-brand-gold" />
            <div className="min-w-0 flex-1">
              {assignment.fileType && (
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {assignment.fileType.toUpperCase()} download
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {assignment.description ??
                  "Download this resource and complete the guided exercises at your own pace."}
              </p>
              {assignment.fileUrl && (
                <Button
                  variant="outline"
                  className="mt-6 border-brand-navy/20"
                  nativeButton={false}
                  render={
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Download className="size-4" />
                  Download assignment
                </Button>
              )}
            </div>
          </div>
        </BrandCard>
      </div>
    );
  }

  const quiz = findQuiz(course, selected.id);
  if (!quiz) return null;

  const isComplete = isItemComplete("quiz", quiz.id, progress);

  return (
    <div className="space-y-6">
      <ContentHeader
        eyebrow="Quiz"
        title={quiz.title}
        description={quiz.description}
        isComplete={isComplete}
        isEnrolled={isEnrolled}
        isPending={isPending}
        onMarkComplete={() => onMarkComplete("quiz", quiz.id)}
      />
      <div className="space-y-4">
        {quiz.questions.length === 0 ? (
          <BrandCard className="border-dashed text-center">
            <ClipboardList className="mx-auto size-8 text-brand-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              Quiz questions will be added soon.
            </p>
          </BrandCard>
        ) : (
          quiz.questions.map((question, index) => (
            <BrandCard key={`${quiz.id}-q-${index}`}>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-gold">
                Question {index + 1}
              </p>
              <p className="mt-2 font-heading text-lg font-light">{question.question}</p>
              <ul className="mt-4 space-y-2">
                {question.options.map((option, optionIndex) => (
                  <li
                    key={`${quiz.id}-q-${index}-o-${optionIndex}`}
                    className="rounded-sm border border-border/70 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </BrandCard>
          ))
        )}
      </div>
    </div>
  );
}

type ContentHeaderProps = {
  eyebrow: string;
  title: string;
  description: string | null;
  isComplete: boolean;
  isEnrolled: boolean;
  isPending: boolean;
  onMarkComplete: () => void;
};

function ContentHeader({
  eyebrow,
  title,
  description,
  isComplete,
  isEnrolled,
  isPending,
  onMarkComplete,
}: ContentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-heading text-3xl font-light">{title}</h2>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {isEnrolled && (
        <Button
          variant={isComplete ? "outline" : "gold"}
          size="sm"
          className="shrink-0"
          disabled={isComplete || isPending}
          onClick={onMarkComplete}
        >
          {isComplete ? (
            <>
              <CheckCircle2 className="size-4" />
              Completed
            </>
          ) : (
            "Mark complete"
          )}
        </Button>
      )}
    </div>
  );
}
