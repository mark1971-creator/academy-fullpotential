"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { syncCurrentUserProfile } from "@/lib/actions/users";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { mapCourse, mapEnrollment } from "@/lib/supabase/mappers";
import { resolveSafeDefault } from "@/lib/supabase/errors";
import { calculateProgressPercent, getCurriculumItemIds } from "@/lib/courses/utils";
import { hasSupabaseAdminConfig, hasSupabaseConfig } from "@/lib/env";
import type {
  CourseWithCurriculum,
  CurriculumItemType,
  EnrollmentWithCourse,
  ItemProgressState,
} from "@/types/lms";

export async function getUserEnrollments(): Promise<EnrollmentWithCourse[]> {
  const { userId } = await auth();
  if (!userId || !hasSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, courses (*)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      ...mapEnrollment(row),
      course: mapCourse(row.courses),
    }));
  } catch (error) {
    return resolveSafeDefault("getUserEnrollments", error, []);
  }
}

export async function isUserEnrolledInCourse(courseId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId || !hasSupabaseConfig()) {
    return false;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) throw error;

    return Boolean(data);
  } catch (error) {
    return resolveSafeDefault("isUserEnrolledInCourse", error, false);
  }
}

export async function enrollInCourse(
  courseId: string,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Sign in to enroll in a program." };
  }

  if (!hasSupabaseAdminConfig()) {
    return { success: false, error: "Enrollment is not available right now." };
  }

  await syncCurrentUserProfile();

  const supabase = createAdminClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, price, is_published, slug")
    .eq("id", courseId)
    .eq("is_published", true)
    .maybeSingle();

  if (courseError || !course) {
    return { success: false, error: "Program not found." };
  }

  if (course.price > 0) {
    return { success: false, error: "Paid programs will be available soon." };
  }

  const { error } = await supabase.from("enrollments").upsert(
    {
      user_id: userId,
      course_id: courseId,
      progress_percent: 0,
    },
    { onConflict: "user_id,course_id", ignoreDuplicates: true },
  );

  if (error) {
    console.error("enrollInCourse:", error.message);
    return { success: false, error: "Could not complete enrollment." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${course.slug}`);

  return { success: true };
}

export async function getCourseItemProgress(
  course: CourseWithCurriculum,
): Promise<ItemProgressState> {
  const { userId } = await auth();
  if (!userId || !hasSupabaseConfig()) {
    return { lessonIds: [], assignmentIds: [], quizIds: [] };
  }

  const itemIds = getCurriculumItemIds(course);

  try {
    const supabase = await createClient();

    const [lessonsResult, assignmentsResult, quizzesResult] = await Promise.all([
      itemIds.lessonIds.length > 0
        ? supabase
            .from("lesson_progress")
            .select("lesson_id")
            .eq("user_id", userId)
            .in("lesson_id", itemIds.lessonIds)
        : Promise.resolve({ data: [], error: null }),
      itemIds.assignmentIds.length > 0
        ? supabase
            .from("assignment_progress")
            .select("assignment_id")
            .eq("user_id", userId)
            .in("assignment_id", itemIds.assignmentIds)
        : Promise.resolve({ data: [], error: null }),
      itemIds.quizIds.length > 0
        ? supabase
            .from("quiz_progress")
            .select("quiz_id")
            .eq("user_id", userId)
            .in("quiz_id", itemIds.quizIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const firstError =
      lessonsResult.error ?? assignmentsResult.error ?? quizzesResult.error;
    if (firstError) throw firstError;

    return {
      lessonIds: (lessonsResult.data ?? []).map((row) => row.lesson_id),
      assignmentIds: (assignmentsResult.data ?? []).map((row) => row.assignment_id),
      quizIds: (quizzesResult.data ?? []).map((row) => row.quiz_id),
    };
  } catch (error) {
    return resolveSafeDefault("getCourseItemProgress", error, {
      lessonIds: [],
      assignmentIds: [],
      quizIds: [],
    });
  }
}

export async function markCurriculumItemComplete(
  itemType: CurriculumItemType,
  itemId: string,
  courseSlug: string,
): Promise<{ success: boolean; error?: string }> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Sign in to track progress." };
  }

  if (!hasSupabaseAdminConfig()) {
    return { success: false, error: "Progress tracking is not available." };
  }

  await syncCurrentUserProfile();
  const supabase = createAdminClient();

  if (itemType === "lesson") {
    const { error } = await supabase.from("lesson_progress").upsert(
      { user_id: userId, lesson_id: itemId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("markCurriculumItemComplete lesson:", error.message);
      return { success: false, error: "Could not save progress." };
    }
  } else if (itemType === "assignment") {
    const { error } = await supabase.from("assignment_progress").upsert(
      { user_id: userId, assignment_id: itemId },
      { onConflict: "user_id,assignment_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("markCurriculumItemComplete assignment:", error.message);
      return { success: false, error: "Could not save progress." };
    }
  } else {
    const { error } = await supabase.from("quiz_progress").upsert(
      { user_id: userId, quiz_id: itemId },
      { onConflict: "user_id,quiz_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("markCurriculumItemComplete quiz:", error.message);
      return { success: false, error: "Could not save progress." };
    }
  }

  await updateEnrollmentProgress(userId, courseSlug);

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${courseSlug}`);

  return { success: true };
}

async function updateEnrollmentProgress(userId: string, courseSlug: string) {
  const { getCourseWithCurriculumBySlug } = await import("@/lib/actions/courses");
  const course = await getCourseWithCurriculumBySlug(courseSlug);
  if (!course) return;

  const progress = await getCourseItemProgress(course);
  const percent = calculateProgressPercent(course, progress);
  const supabase = createAdminClient();

  await supabase
    .from("enrollments")
    .update({
      progress_percent: percent,
      completed_at: percent === 100 ? new Date().toISOString() : null,
    })
    .eq("user_id", userId)
    .eq("course_id", course.id);
}
