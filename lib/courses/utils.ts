import type { Assignment, CourseWithCurriculum, Lesson } from "@/types/lms";

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDuration(minutes: number | null) {
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getFirstLesson(course: CourseWithCurriculum): Lesson | null {
  for (const module of course.modules) {
    if (module.lessons.length > 0) {
      return module.lessons[0];
    }
  }
  return null;
}

export function getAllAssignments(course: CourseWithCurriculum): Assignment[] {
  const assignments: Assignment[] = [];

  for (const module of course.modules) {
    assignments.push(...module.assignments);
    for (const lesson of module.lessons) {
      assignments.push(...lesson.assignments);
    }
  }

  return assignments;
}
