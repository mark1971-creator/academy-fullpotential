"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  ListVideo,
  Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getYoutubeThumbnail } from "@/lib/courses/youtube";
import { formatLessonDuration, isItemComplete } from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type { CourseWithCurriculum, ItemProgressState, Lesson } from "@/types/lms";

type CurriculumSidebarProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
  className?: string;
};

export function CurriculumSidebar({
  course,
  progress,
  selectedLessonId,
  onSelectLesson,
  className,
}: CurriculumSidebarProps) {
  return (
    <Card className={cn("overflow-hidden border-border/70 shadow-md", className)}>
      <CardHeader className="border-b border-border/60 bg-brand-teal/[0.04] pb-4">
        <div className="flex items-center gap-2">
          <ListVideo className="size-5 text-brand-teal" />
          <CardTitle className="text-lg text-brand-navy">Course Curriculum</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground">
          {course.modules.length} modules ·{" "}
          {course.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {course.modules.map((module, moduleIndex) => (
            <ModuleAccordion
              key={module.id}
              moduleIndex={moduleIndex}
              moduleTitle={module.title}
              lessons={module.lessons}
              progress={progress}
              selectedLessonId={selectedLessonId}
              onSelectLesson={onSelectLesson}
              defaultOpen={moduleIndex === 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type ModuleAccordionProps = {
  moduleIndex: number;
  moduleTitle: string;
  lessons: Lesson[];
  progress: ItemProgressState;
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Lesson) => void;
  defaultOpen?: boolean;
};

function ModuleAccordion({
  moduleIndex,
  moduleTitle,
  lessons,
  progress,
  selectedLessonId,
  onSelectLesson,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const completedCount = lessons.filter((lesson) =>
    isItemComplete("lesson", lesson.id, progress),
  ).length;

  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Module {moduleIndex + 1}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-brand-navy">
            {moduleTitle.replace(/^Module \d+:\s*/i, "")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {completedCount}/{lessons.length} complete
          </p>
        </div>
        <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>

      <ul className="space-y-1 border-t border-border/40 bg-muted/20 px-2 py-2">
        {lessons.map((lesson, lessonIndex) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            lessonIndex={lessonIndex}
            isSelected={selectedLessonId === lesson.id}
            isComplete={isItemComplete("lesson", lesson.id, progress)}
            onSelect={() => onSelectLesson(lesson)}
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
          "flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-all",
          isSelected
            ? "bg-brand-teal/10 ring-1 ring-brand-teal/25"
            : "hover:bg-background/80",
        )}
      >
        <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-brand-navy/5">
          {isVideo && thumbnail ? (
            <>
              <Image
                src={thumbnail}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/30">
                <span className="flex size-7 items-center justify-center rounded-full bg-white/95 text-brand-teal shadow-sm">
                  <Play className="size-3.5 fill-brand-teal" />
                </span>
              </span>
              {duration && (
                <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-medium text-white">
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
              className="mb-1 h-5 border-brand-teal/15 px-1.5 text-[10px] font-normal text-brand-teal"
            >
              {isVideo ? `Part ${lessonIndex + 1}` : "Resource"}
            </Badge>
            {isComplete ? (
              <CheckCircle2 className="size-4 shrink-0 text-brand-gold" />
            ) : (
              <Circle className="size-4 shrink-0 text-border" />
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
