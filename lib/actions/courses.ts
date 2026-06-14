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
 * Serializes any thrown value into a useful log string.
 *
 * Supabase surfaces query failures as a `PostgrestError` plain object
 * (`{ message, code, details, hint }`) that is NOT an `Error` instance, so a
 * naive `String(error)` logs the useless `"[object Object]"`. We extract the
 * structured fields so Vercel function logs reveal the real cause (e.g. an
 * invalid API key → `code=PGRST301`, a missing relationship → `code=PGRST200`,
 * a missing table/column → `code=42P01`/`42703`). None of these fields contain
 * secrets, so this is safe to log in production.
 */
function describeError(error: unknown): string {
  if (error && typeof error === "object") {
    const e = error as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
      hint?: unknown;
      status?: unknown;
    };
    const parts = [
      typeof e.message === "string" ? `message=${e.message}` : null,
      e.code != null ? `code=${e.code}` : null,
      e.status != null ? `status=${e.status}` : null,
      e.details != null ? `details=${e.details}` : null,
      e.hint != null ? `hint=${e.hint}` : null,
    ].filter(Boolean);
    if (parts.length > 0) return parts.join(" | ");
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * Logs the Supabase project host (public, from NEXT_PUBLIC_SUPABASE_URL) so the
 * logs confirm which project the deployment is actually pointing at. Helps catch
 * the common case where Vercel env vars point to a different/paused project than
 * local. Never logs keys.
 */
function supabaseHostHint(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "supabaseUrl=<unset>";
  try {
    return `supabaseHost=${new URL(url).host}`;
  } catch {
    return "supabaseUrl=<invalid>";
  }
}

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
          `Verify NEXT_PUBLIC_SUPABASE_URL points to an existing, running project and that the keys are correct. ` +
          `(${supabaseHostHint()})`,
      );
      return fallback();
    }

    console.error(
      `[${label}] Supabase is unreachable (connectivity error) — ${supabaseHostHint()}: ${describeError(error)}`,
    );
    throw new Error(
      "Cannot reach the database. Please verify the Supabase project URL and API keys.",
    );
  }

  console.error(
    `[${label}] Query failed — ${supabaseHostHint()}: ${describeError(error)}`,
  );
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
    if (!shouldUseLocalDataFallback()) {
      // Production with no Supabase config: this returns null → notFound() (a
      // 404), which is easy to mistake for "course doesn't exist". Surface it.
      console.error(
        `[getCourseWithCurriculumBySlug] Supabase env vars are not present in this deployment ` +
          `(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY). ${supabaseHostHint()}. ` +
          `Set them for the Production environment in Vercel and redeploy.`,
      );
      return null;
    }
    return getFixtureCourseWithCurriculumBySlug(slug);
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
      console.warn(
        `[getCourseWithCurriculumBySlug] No published course found for slug="${slug}" ` +
          `(${supabaseHostHint()}). The query succeeded but returned no row — likely a schema/data ` +
          `difference (course not published, or RLS hiding it) on this project.`,
      );
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
