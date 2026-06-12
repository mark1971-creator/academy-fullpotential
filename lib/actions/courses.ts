"use server";

import { createClient } from "@/lib/supabase/server";
import {
  mapAssignment,
  mapCourse,
  mapLesson,
  mapModule,
} from "@/lib/supabase/mappers";
import { hasSupabaseConfig } from "@/lib/env";
import type { Course, CourseWithCurriculum, Lesson } from "@/types/lms";

type LessonRow = {
  id: string;
  module_id: string;
  title: string;
  youtube_url: string | null;
  content: string | null;
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
};

type CurriculumRow = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  price: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  modules: ModuleRow[];
};

const CURRICULUM_SELECT = `
  *,
  modules (
    *,
    lessons (
      *,
      assignments (*)
    ),
    assignments (*)
  )
`;

function mapLessonWithAssignments(row: LessonRow): Lesson {
  const lesson = mapLesson(row);
  const assignments = (row.assignments ?? [])
    .filter((assignment) => assignment.lesson_id !== null)
    .map(mapAssignment);

  return { ...lesson, assignments };
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
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(CURRICULUM_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("getCourseWithCurriculumBySlug:", error.message);
    throw new Error("Failed to load course curriculum");
  }

  if (!data) {
    return null;
  }

  return mapCourseWithCurriculum(data as CurriculumRow);
}

function mapCourseWithCurriculum(row: CurriculumRow): CourseWithCurriculum {
  const course = mapCourse(row);

  const modules = (row.modules ?? [])
    .map((moduleRow) => {
      const module = mapModule(moduleRow);
      const lessons = (moduleRow.lessons ?? [])
        .map(mapLessonWithAssignments)
        .sort((a, b) => a.order - b.order);
      const assignments = (moduleRow.assignments ?? [])
        .filter((assignment) => assignment.module_id !== null)
        .map(mapAssignment);

      return { ...module, lessons, assignments };
    })
    .sort((a, b) => a.order - b.order);

  return {
    ...course,
    modules,
  };
}
