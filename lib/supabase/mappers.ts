import type { Database } from "@/types/database";
import type {
  Assignment,
  Course,
  Enrollment,
  Lesson,
  Module,
  Profile,
  UserProgress,
} from "@/types/lms";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type ModuleRow = Database["public"]["Tables"]["modules"]["Row"];
type LessonRow = Database["public"]["Tables"]["lessons"]["Row"];
type AssignmentRow = Database["public"]["Tables"]["assignments"]["Row"];
type EnrollmentRow = Database["public"]["Tables"]["enrollments"]["Row"];
type UserProgressRow = Database["public"]["Tables"]["lesson_progress"]["Row"];

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    slug: row.slug,
    thumbnailUrl: row.image_url,
    price: row.price,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapModule(row: ModuleRow): Module {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapLesson(row: LessonRow): Omit<Lesson, "assignments"> {
  return {
    id: row.id,
    moduleId: row.module_id,
    title: row.title,
    youtubeUrl: row.youtube_url,
    content: row.content,
    durationMinutes: row.duration_minutes,
    order: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAssignment(row: AssignmentRow): Assignment {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    fileType: row.file_type,
    lessonId: row.lesson_id,
    moduleId: row.module_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    userId: row.user_id,
    courseId: row.course_id,
    progressPercent: row.progress_percent,
    enrolledAt: row.enrolled_at,
    completedAt: row.completed_at,
  };
}

export function mapUserProgress(row: UserProgressRow): UserProgress {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    completedAt: row.completed_at,
  };
}

/** @deprecated Use mapUserProgress */
export const mapLessonProgress = mapUserProgress;
