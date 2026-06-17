import type { CourseWithCurriculum, Lesson } from "@/types/lms";

/** Suffix used in seeded placeholder lesson titles — search for this when replacing content. */
export const PLACEHOLDER_LESSON_TITLE_MARKER = "Content coming soon";

export const PLACEHOLDER_LESSON_CONTENT =
  "Video and materials for this module are being prepared. The curriculum structure is in place — replace this placeholder lesson in supabase/seed-data/placeholder-lessons.mjs (or add real lessons via seed_lessons.mjs) when content is ready.";

export function buildPlaceholderLessonTitle(moduleTitle: string) {
  return `${moduleTitle} — ${PLACEHOLDER_LESSON_TITLE_MARKER}`;
}

export function isPlaceholderLesson(lesson: Pick<Lesson, "title">) {
  return lesson.title.includes(PLACEHOLDER_LESSON_TITLE_MARKER);
}

export function courseHasPlaceholderContent(course: CourseWithCurriculum) {
  const lessons = course.modules.flatMap((module) => module.lessons);
  return lessons.length > 0 && lessons.every(isPlaceholderLesson);
}
