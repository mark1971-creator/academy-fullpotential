/** Canonical catalog display order (matches product priority). */
export const CATALOG_COURSE_SLUG_ORDER = [
  "human-potential-coach-certification",
  "idg-coach-certification",
  "from-fragmentation-to-wholeness",
  "breakthroughs-employee-experience",
  "human-potential-team-coach-certification",
] as const;

export function sortCoursesForCatalog<T extends { slug: string }>(courses: T[]): T[] {
  const order = new Map<string, number>(
    CATALOG_COURSE_SLUG_ORDER.map((slug, index) => [slug, index]),
  );

  return [...courses].sort((a, b) => {
    const aIndex = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.slug.localeCompare(b.slug);
  });
}

/** One row per slug — keeps the first match when the DB has duplicate seeds. */
export function dedupeCoursesBySlug<T extends { slug: string }>(courses: T[]): T[] {
  const seen = new Map<string, T>();
  for (const course of courses) {
    if (!seen.has(course.slug)) {
      seen.set(course.slug, course);
    }
  }
  return [...seen.values()];
}

export function prepareCoursesForCatalog<T extends { slug: string }>(courses: T[]): T[] {
  return sortCoursesForCatalog(dedupeCoursesBySlug(courses));
}
