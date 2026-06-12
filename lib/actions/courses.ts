"use server";

import { createClient } from "@/lib/supabase/server";
import { mapCourse } from "@/lib/supabase/mappers";
import { hasSupabaseConfig } from "@/lib/env";
import type { Course } from "@/types/lms";

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
