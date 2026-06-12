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
  heroVideoUrl: string | null;
  durationLabel: string | null;
  level: string | null;
  rating: number | null;
  ratingCount: number;
  enrolledCount: number;
  whatYouWillLearn: string[];
  tags: string[];
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LessonType = "video" | "resource";

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
  lessonType: LessonType;
  youtubeUrl: string | null;
  content: string | null;
  durationLabel: string | null;
  durationMinutes: number | null;
  order: number;
  assignments: Assignment[];
  quizzes: Quiz[];
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

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  lessonId: string | null;
  moduleId: string | null;
  order: number;
  questions: QuizQuestion[];
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

export type AssignmentProgress = {
  id: string;
  userId: string;
  assignmentId: string;
  completedAt: string;
};

export type QuizProgress = {
  id: string;
  userId: string;
  quizId: string;
  completedAt: string;
};

export type CurriculumItemType = "lesson" | "assignment" | "quiz";

export type CurriculumItem = {
  type: CurriculumItemType;
  id: string;
  title: string;
  moduleId: string;
  lessonType?: LessonType;
  durationLabel?: string | null;
  durationMinutes?: number | null;
  fileType?: AssignmentFileType;
  questionCount?: number;
};

export type ItemProgressState = {
  lessonIds: string[];
  assignmentIds: string[];
  quizIds: string[];
};

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
  assignments: Assignment[];
  quizzes: Quiz[];
};

export type CourseWithCurriculum = Course & {
  modules: ModuleWithLessons[];
};

export type EnrollmentWithCourse = Enrollment & {
  course: Course;
};
