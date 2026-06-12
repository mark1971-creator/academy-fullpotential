"use server";

import { createClient } from "@/lib/supabase/server";
import {
  mapAssignment,
  mapCourse,
  mapLesson,
  mapModule,
  mapQuiz,
} from "@/lib/supabase/mappers";
import { hasSupabaseConfig } from "@/lib/env";
import type { Database } from "@/types/database";
import type { Course, CourseWithCurriculum, Lesson } from "@/types/lms";

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
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPublishedCourses:", error.message);
    throw new Error("Failed to load courses");
  }

  return (data ?? []).map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getCourseBySlug:", error.message);
    throw new Error("Failed to load course");
  }

  return data ? mapCourse(data) : null;
}

export async function getCourseWithCurriculumBySlug(
  slug: string,
): Promise<CourseWithCurriculum | null> {
  if (!hasSupabaseConfig()) {
    console.warn("Supabase config missing");
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules (
        *,
        lessons (*)
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getCourseWithCurriculumBySlug - Supabase Error:", error);
    throw new Error(`Failed to load course: ${error.message}`);
  }

  if (!data) {
    console.warn("Course not found:", slug);
    return null;
  }

  // Simple, safe mapping
  const course = mapCourse(data);

  const modules = (data.modules ?? [])
    .map((moduleRow: any) => {
      const module = mapModule(moduleRow);
      const lessons = (moduleRow.lessons ?? [])
        .map((lessonRow: any) => mapLesson(lessonRow))
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

      return { ...module, lessons };
    })
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  return {
    ...course,
    modules,
  } as CourseWithCurriculum;
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
