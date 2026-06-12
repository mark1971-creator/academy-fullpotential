"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  ChevronDown,
  FileText,
  FolderOpen,
  ListVideo,
} from "lucide-react";

import { CurriculumSidebar } from "@/components/course/CurriculumSidebar";
import { YouTubePlayer } from "@/components/courses/youtube-player";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { markCurriculumItemComplete } from "@/lib/actions/enrollments";
import {
  calculateLessonProgressPercent,
  findLesson,
  formatLessonDuration,
  getFirstLesson,
} from "@/lib/courses/utils";
import { cn } from "@/lib/utils";
import type { CourseWithCurriculum, ItemProgressState, Lesson } from "@/types/lms";

type CoursePlayerProps = {
  course: CourseWithCurriculum;
  progress: ItemProgressState;
  isEnrolled: boolean;
};

export function CoursePlayer({ course, progress, isEnrolled }: CoursePlayerProps) {
  const firstLesson = useMemo(() => getFirstLesson(course), [course]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    firstLesson?.id ?? null,
  );
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedLesson = selectedLessonId
    ? findLesson(course, selectedLessonId)
    : firstLesson;

  const progressPercent = calculateLessonProgressPercent(course, progress);
  const completedLessons = progress.lessonIds.length;
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  function handleSelectLesson(lesson: Lesson) {
    setSelectedLessonId(lesson.id);
    setMobileCurriculumOpen(false);
  }

  function handleMarkComplete() {
    if (!selectedLesson || !isEnrolled) return;

    startTransition(async () => {
      await markCurriculumItemComplete("lesson", selectedLesson.id, course.slug);
    });
  }

  const isLessonComplete =
    selectedLesson != null &&
    progress.lessonIds.includes(selectedLesson.id);

  return (
    <div className="space-y-6">
      <Card className="border-brand-teal/15 bg-gradient-to-r from-brand-teal/[0.06] to-brand-gold/[0.06]">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-brand-navy">Your progress</p>
                {isEnrolled && (
                  <Badge variant="gold" className="font-normal">
                    {completedLessons} of {totalLessons} lessons
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <Progress value={progressPercent} className="h-2.5 flex-1" />
                <span className="text-lg font-semibold tabular-nums text-brand-teal">
                  {progressPercent}%
                </span>
              </div>
            </div>
            {!isEnrolled && (
              <p className="text-sm text-muted-foreground">
                Enroll to track your progress through the certification.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3.5 text-left shadow-sm lg:hidden"
        onClick={() => setMobileCurriculumOpen((open) => !open)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-brand-navy">
          <ListVideo className="size-4 text-brand-teal" />
          Browse curriculum
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            mobileCurriculumOpen && "rotate-180",
          )}
        />
      </button>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
        <div
          className={cn(
            "lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto",
            mobileCurriculumOpen ? "block" : "hidden lg:block",
          )}
        >
          <CurriculumSidebar
            course={course}
            progress={progress}
            selectedLessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        <div className="min-w-0">
          {selectedLesson ? (
            <LessonContent
              lesson={selectedLesson}
              isEnrolled={isEnrolled}
              isComplete={isLessonComplete}
              isPending={isPending}
              onMarkComplete={handleMarkComplete}
            />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <ListVideo className="size-10 text-brand-teal/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Select a lesson from the curriculum to begin.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

type LessonContentProps = {
  lesson: Lesson;
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
    <Card className="overflow-hidden border-border/70 shadow-md">
      <CardHeader className="border-b border-border/50 bg-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Badge
              variant={isVideo ? "default" : "outline"}
              className={cn(
                "mb-3",
                isVideo ? "bg-brand-teal" : "border-brand-teal/30 text-brand-teal",
              )}
            >
              {isVideo ? "Video lesson" : "Resource"}
            </Badge>
            <CardTitle className="text-2xl text-brand-navy sm:text-3xl">
              {lesson.title}
            </CardTitle>
            {duration && (
              <p className="mt-2 text-sm text-muted-foreground">Duration: {duration}</p>
            )}
            {lesson.content && (
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {lesson.content}
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
                "Mark as complete"
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 sm:p-0">
        {isVideo ? (
          <YouTubePlayer
            url={lesson.youtubeUrl}
            title={lesson.title}
            className="rounded-none"
          />
        ) : (
          <div className="flex items-start gap-4 p-6 sm:p-8">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
              {lesson.title.toLowerCase().includes("check") ? (
                <FileText className="size-6" />
              ) : (
                <FolderOpen className="size-6" />
              )}
            </span>
            <div>
              <p className="font-medium text-brand-navy">Program resource</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {lesson.content ??
                  "This resource is provided as part of your certification. Contact your program coordinator for access."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
