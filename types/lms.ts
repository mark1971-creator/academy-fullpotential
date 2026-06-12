export type Profile = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnailUrl: string | null;
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  youtubeUrl: string | null;
  content: string | null;
  durationMinutes: number | null;
  order: number;
  assignments: Assignment[];
  createdAt: string;
  updatedAt: string;
};

export type AssignmentFileType = "pdf" | "doc" | "docx";

export type Assignment = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: AssignmentFileType;
  lessonId: string | null;
  moduleId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  enrolledAt: string;
  completedAt: string | null;
};

/** Per-lesson completion record for a user. */
export type UserProgress = {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: string;
};

/** @deprecated Use UserProgress */
export type LessonProgress = UserProgress;

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
  assignments: Assignment[];
};

export type CourseWithCurriculum = Course & {
  modules: ModuleWithLessons[];
};

export type EnrollmentWithCourse = Enrollment & {
  course: Course;
};
