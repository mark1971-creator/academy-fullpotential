// Placeholder lesson helpers for seed_placeholder_lessons.mjs
// Keep in sync with lib/courses/placeholders.ts

export const PLACEHOLDER_LESSON_TITLE_MARKER = "Content coming soon";

export const PLACEHOLDER_LESSON_CONTENT =
  "Video and materials for this module are being prepared. The curriculum structure is in place — replace this placeholder lesson in supabase/seed-data/placeholder-lessons.mjs (or add real lessons via seed_lessons.mjs) when content is ready.";

export function buildPlaceholderLessonTitle(moduleTitle) {
  return `${moduleTitle} — ${PLACEHOLDER_LESSON_TITLE_MARKER}`;
}

/** Course slugs that receive placeholder lessons when no curriculum is seeded yet. */
export const PLACEHOLDER_COURSE_SLUGS = [
  "idg-coach-certification",
];
