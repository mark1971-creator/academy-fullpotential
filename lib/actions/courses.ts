"use server";

import { unstable_rethrow } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  mapAssignment,
  mapCourse,
  mapLesson,
  mapModule,
  mapQuiz,
} from "@/lib/supabase/mappers";
import { hasSupabaseConfig, shouldUseLocalDataFallback } from "@/lib/env";
import {
  getFixtureCourseBySlug,
  getFixtureCourseWithCurriculumBySlug,
  getFixtureCourses,
} from "@/lib/courses/fixtures";
import { isConnectivityError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { Course, CourseWithCurriculum, Lesson } from "@/types/lms";

/**
 * Centralized handling for query failures. Connectivity failures fall back to
 * local fixture data in development (or rethrow a clear message in production);
 * all other errors rethrow a generic, safe message.
 */
function handleQueryError<T>(
  label: string,
  error: unknown,
  fallback: () => T,
): T {
  // Never swallow Next.js internal control-flow signals (dynamic rendering via
  // cookies()/headers(), redirect, notFound) — re-throw them untouched.
  unstable_rethrow(error);

  if (isConnectivityError(error)) {
    if (shouldUseLocalDataFallback()) {
      console.warn(
        `[${label}] Supabase is unreachable — serving local development fallback data. ` +
          `Verify NEXT_PUBLIC_SUPABASE_URL points to an existing, running project and that the keys are correct.`,
      );
      return fallback();
    }

    console.error(`[${label}] Supabase is unreachable (connectivity error):`, error);
    throw new Error(
      "Cannot reach the database. Please verify the Supabase project URL and API keys.",
    );
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${label}]`, message);
  throw new Error("Failed to load course data");
}

type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];

type LessonRow = {
  id: string;
  module_id: string;
  title: string;
  youtube_url: string | null;
  content: string | null;
  lesson_type: "video" | "resource";
  duration_label: string | null;
  duration_minutes: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  assignments: Array<{
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    file_type: "pdf" | "doc" | "docx";
    lesson_id: string | null;
    module_id: string | null;
    created_at: string;
    updated_at: string;
  }>;
  quizzes: QuizRow[];
};

type ModuleRow = {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  lessons: LessonRow[];
  assignments: Array<{
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    file_type: "pdf" | "doc" | "docx";
    lesson_id: string | null;
    module_id: string | null;
    created_at: string;
    updated_at: string;
  }>;
  quizzes: QuizRow[];
};

type CurriculumRow = Database["public"]["Tables"]["courses"]["Row"] & {
  modules: ModuleRow[];
};

const CURRICULUM_SELECT = `
  *,
  modules (
    *,
    lessons (
      *,
      assignments (*),
      quizzes (*)
    ),
    assignments (*),
    quizzes (*)
  )
`;

function mapLessonWithNested(row: LessonRow): Lesson {
  const lesson = mapLesson(row);
  const assignments = (row.assignments ?? [])
    .filter((assignment) => assignment.lesson_id !== null)
    .map(mapAssignment);
  const quizzes = (row.quizzes ?? [])
    .filter((quiz) => quiz.lesson_id !== null)
    .map(mapQuiz)
    .sort((a, b) => a.order - b.order);

  return { ...lesson, assignments, quizzes };
}

export async function getPublishedCourses(): Promise<Course[]> {
  if (!hasSupabaseConfig()) {
    return shouldUseLocalDataFallback() ? getFixtureCourses() : [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map(mapCourse);
  } catch (error) {
    return handleQueryError("getPublishedCourses", error, getFixtureCourses);
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!hasSupabaseConfig()) {
    return shouldUseLocalDataFallback() ? getFixtureCourseBySlug(slug) : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;

    return data ? mapCourse(data) : null;
  } catch (error) {
    return handleQueryError("getCourseBySlug", error, () =>
      getFixtureCourseBySlug(slug),
    );
  }
}

export async function getCourseWithCurriculumBySlug(
  slug: string,
): Promise<CourseWithCurriculum | null> {
  if (!hasSupabaseConfig()) {
    return shouldUseLocalDataFallback()
      ? getFixtureCourseWithCurriculumBySlug(slug)
      : null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select(CURRICULUM_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return null;
    }

    return mapCourseWithCurriculum(data as CurriculumRow);
  } catch (error) {
    return handleQueryError("getCourseWithCurriculumBySlug", error, () =>
      getFixtureCourseWithCurriculumBySlug(slug),
    );
  }
}

function mapCourseWithCurriculum(row: CurriculumRow): CourseWithCurriculum {
  const course = mapCourse(row);

  const modules = (row.modules ?? [])
    .map((moduleRow) => {
      const module = mapModule(moduleRow);
      const lessons = (moduleRow.lessons ?? [])
        .map(mapLessonWithNested)
        .sort((a, b) => a.order - b.order);
      const assignments = (moduleRow.assignments ?? [])
        .filter((assignment) => assignment.module_id !== null)
        .map(mapAssignment);
      const quizzes = (moduleRow.quizzes ?? [])
        .filter((quiz) => quiz.module_id !== null)
        .map(mapQuiz)
        .sort((a, b) => a.order - b.order);

      return { ...module, lessons, assignments, quizzes };
    })
    .sort((a, b) => a.order - b.order);

  return {
    ...course,
    modules,
  };
}
