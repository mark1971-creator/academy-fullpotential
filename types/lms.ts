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
  imageUrl: string | null;
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Module = {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  videoUrl: string | null;
  content: string | null;
  durationMinutes: number | null;
  sortOrder: number;
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

export type LessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: string;
};

export type CourseWithCurriculum = Course & {
  modules: Array<
    Module & {
      lessons: Lesson[];
    }
  >;
};

export type EnrollmentWithCourse = Enrollment & {
  course: Course;
};
