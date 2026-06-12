"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock, PlayCircle } from "lucide-react";

import { YouTubePlayer } from "@/components/courses/youtube-player";
import { BrandCard } from "@/components/ui/brand-elements";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/courses/utils";
import type { CourseWithCurriculum, Lesson } from "@/types/lms";

type CourseCurriculumProps = {
  course: CourseWithCurriculum;
};

export function CourseCurriculum({ course }: CourseCurriculumProps) {
  const firstLesson = useMemo(() => {
    for (const module of course.modules) {
      if (module.lessons.length > 0) {
        return module.lessons[0];
      }
    }
    return null;
  }, [course.modules]);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    firstLesson?.id ?? null,
  );
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(course.modules.map((module) => module.id)),
  );

  const selectedLesson: Lesson | null = useMemo(() => {
    if (!selectedLessonId) return firstLesson;
    for (const module of course.modules) {
      const lesson = module.lessons.find((item) => item.id === selectedLessonId);
      if (lesson) return lesson;
    }
    return firstLesson;
  }, [course.modules, firstLesson, selectedLessonId]);

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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="space-y-3">
        {course.modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-sm border border-border/80 bg-card"
            >
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
                    Module {moduleIndex + 1}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-light">{module.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {module.lessons.length} lesson{module.lessons.length === 1 ? "" : "s"}
                    {module.assignments.length > 0
                      ? ` · ${module.assignments.length} assignment${module.assignments.length === 1 ? "" : "s"}`
                      : ""}
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
                  {module.lessons.map((lesson) => {
                    const isSelected = selectedLesson?.id === lesson.id;
                    const duration = formatDuration(lesson.durationMinutes);

                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedLessonId(lesson.id)}
                          className={cn(
                            "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors",
                            isSelected
                              ? "bg-brand-gold/8 text-foreground"
                              : "hover:bg-muted/30",
                          )}
                        >
                          <PlayCircle
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              isSelected ? "text-brand-gold" : "text-muted-foreground",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{lesson.title}</span>
                            {duration && (
                              <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="size-3" />
                                {duration}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="lg:sticky lg:top-24">
        {selectedLesson ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
                Now playing
              </p>
              <h3 className="mt-2 font-heading text-2xl font-light">{selectedLesson.title}</h3>
              {selectedLesson.content && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selectedLesson.content}
                </p>
              )}
            </div>
            <YouTubePlayer url={selectedLesson.youtubeUrl} title={selectedLesson.title} />
          </div>
        ) : (
          <BrandCard className="text-center">
            <PlayCircle className="mx-auto size-8 text-brand-gold" />
            <p className="mt-4 text-sm text-muted-foreground">
              Select a lesson to preview the video.
            </p>
          </BrandCard>
        )}
      </div>
    </div>
  );
}
