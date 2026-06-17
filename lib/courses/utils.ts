import type {
  Assignment,
  Course,
  CourseWithCurriculum,
  CurriculumItem,
  ItemProgressState,
  Lesson,
  ModuleWithLessons,
  Quiz,
} from "@/types/lms";

export function formatPrice(price: number) {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDuration(minutes: number | null) {
  if (minutes == null) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function formatLessonDuration(lesson: {
  durationLabel: string | null;
  durationMinutes: number | null;
}) {
  if (lesson.durationLabel) return lesson.durationLabel;
  return formatDuration(lesson.durationMinutes);
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function getFirstLesson(course: CourseWithCurriculum): Lesson | null {
  for (const module of course.modules) {
    if (module.lessons.length > 0) {
      return module.lessons[0];
    }
  }
  return null;
}

export function getFirstVideoLesson(course: CourseWithCurriculum): Lesson | null {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.lessonType === "video" && lesson.youtubeUrl) {
        return lesson;
      }
    }
  }
  return null;
}

export function getHeroVideoUrl(
  course:
    | Pick<CourseWithCurriculum, "heroVideoUrl" | "modules">
    | Pick<Course, "heroVideoUrl">,
): string | null {
  if (course.heroVideoUrl && !course.heroVideoUrl.includes("[")) {
    return course.heroVideoUrl;
  }
  if ("modules" in course && course.modules.length > 0 && "lessons" in course.modules[0]) {
    return getFirstVideoLesson(course as CourseWithCurriculum)?.youtubeUrl ?? null;
  }
  return null;
}

export function getPreviewLessonCount(course: { modules: Array<{ lessonCount: number }> }) {
  return course.modules.reduce((total, module) => total + module.lessonCount, 0);
}

export function calculateLessonProgressPercent(
  course: CourseWithCurriculum,
  progress: ItemProgressState,
) {
  const lessonIds = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.id),
  );

  if (lessonIds.length === 0) return 0;

  const completed = progress.lessonIds.filter((id) => lessonIds.includes(id)).length;
  return Math.round((completed / lessonIds.length) * 100);
}

export function getAllAssignments(course: CourseWithCurriculum): Assignment[] {
  const assignments: Assignment[] = [];

  for (const module of course.modules) {
    assignments.push(...module.assignments);
    for (const lesson of module.lessons) {
      assignments.push(...lesson.assignments);
    }
  }

  return assignments;
}

export function getModuleCurriculumItems(module: ModuleWithLessons): CurriculumItem[] {
  const items: CurriculumItem[] = [];

  for (const lesson of module.lessons) {
    items.push({
      type: "lesson",
      id: lesson.id,
      title: lesson.title,
      moduleId: module.id,
      lessonType: lesson.lessonType,
      durationLabel: lesson.durationLabel,
      durationMinutes: lesson.durationMinutes,
    });

    for (const assignment of lesson.assignments) {
      items.push({
        type: "assignment",
        id: assignment.id,
        title: assignment.title,
        moduleId: module.id,
        fileType: assignment.fileType ?? undefined,
      });
    }

    for (const quiz of lesson.quizzes) {
      items.push({
        type: "quiz",
        id: quiz.id,
        title: quiz.title,
        moduleId: module.id,
        questionCount: quiz.questions.length,
      });
    }
  }

  for (const assignment of module.assignments) {
    items.push({
      type: "assignment",
      id: assignment.id,
      title: assignment.title,
      moduleId: module.id,
      fileType: assignment.fileType ?? undefined,
    });
  }

  for (const quiz of module.quizzes) {
    items.push({
      type: "quiz",
      id: quiz.id,
      title: quiz.title,
      moduleId: module.id,
      questionCount: quiz.questions.length,
    });
  }

  return items;
}

export function getCurriculumItemIds(course: CourseWithCurriculum) {
  const lessonIds: string[] = [];
  const assignmentIds: string[] = [];
  const quizIds: string[] = [];

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      lessonIds.push(lesson.id);
      assignmentIds.push(...lesson.assignments.map((item) => item.id));
      quizIds.push(...lesson.quizzes.map((item) => item.id));
    }
    assignmentIds.push(...module.assignments.map((item) => item.id));
    quizIds.push(...module.quizzes.map((item) => item.id));
  }

  return { lessonIds, assignmentIds, quizIds };
}

export function getCurriculumItemCount(course: CourseWithCurriculum) {
  const ids = getCurriculumItemIds(course);
  return ids.lessonIds.length + ids.assignmentIds.length + ids.quizIds.length;
}

export function calculateProgressPercent(
  course: CourseWithCurriculum,
  progress: ItemProgressState,
) {
  const total = getCurriculumItemCount(course);
  if (total === 0) return 0;

  const completed =
    progress.lessonIds.length +
    progress.assignmentIds.length +
    progress.quizIds.length;

  return Math.round((completed / total) * 100);
}

export function isItemComplete(
  type: CurriculumItem["type"],
  id: string,
  progress: ItemProgressState,
) {
  if (type === "lesson") return progress.lessonIds.includes(id);
  if (type === "assignment") return progress.assignmentIds.includes(id);
  return progress.quizIds.includes(id);
}

export function findLesson(course: CourseWithCurriculum, lessonId: string): Lesson | null {
  for (const module of course.modules) {
    const lesson = module.lessons.find((item) => item.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

export function findAssignment(
  course: CourseWithCurriculum,
  assignmentId: string,
): Assignment | null {
  for (const module of course.modules) {
    const moduleAssignment = module.assignments.find((item) => item.id === assignmentId);
    if (moduleAssignment) return moduleAssignment;

    for (const lesson of module.lessons) {
      const lessonAssignment = lesson.assignments.find((item) => item.id === assignmentId);
      if (lessonAssignment) return lessonAssignment;
    }
  }
  return null;
}

export function findQuiz(course: CourseWithCurriculum, quizId: string): Quiz | null {
  for (const module of course.modules) {
    const moduleQuiz = module.quizzes.find((item) => item.id === quizId);
    if (moduleQuiz) return moduleQuiz;

    for (const lesson of module.lessons) {
      const lessonQuiz = lesson.quizzes.find((item) => item.id === quizId);
      if (lessonQuiz) return lessonQuiz;
    }
  }
  return null;
}

export function getFirstCurriculumItem(course: CourseWithCurriculum): CurriculumItem | null {
  for (const module of course.modules) {
    const items = getModuleCurriculumItems(module);
    const lesson = items.find((item) => item.type === "lesson");
    if (lesson) return lesson;
  }

  for (const module of course.modules) {
    const items = getModuleCurriculumItems(module);
    const assignment = items.find((item) => item.type === "assignment");
    if (assignment) return assignment;
  }

  return null;
}

export function toSelectedCurriculumItem(
  item: CurriculumItem | null,
): { type: "lesson" | "assignment"; id: string } | null {
  if (item?.type === "lesson" || item?.type === "assignment") {
    return { type: item.type, id: item.id };
  }
  return null;
}
