import type { Assignment, Lesson, LessonType, ModuleWithLessons } from "@/types/lms";

const FIXTURE_TIMESTAMP = "2026-01-01T00:00:00.000Z";

const RESOURCE_CONTENT =
  "Download worksheets, guides, and reference materials for this module. Use the assignment downloads when available, or check back as your facilitator adds files.";

export function stripModulePrefix(title: string) {
  return title.replace(/^(Module|Week) \d+:\s*/i, "").trim();
}

type CurriculumAssignment = {
  sort_order: number;
  title: string;
  description: string;
};

type CurriculumLesson = {
  moduleOrder: number;
  title: string;
  youtubeUrl: string | null;
  lessonType: LessonType;
  content?: string | null;
  sortOrder: number;
};

type StandardCurriculumInput = {
  courseId: string;
  moduleTitles: string[];
  introVideoUrl: string | null;
  assignments: CurriculumAssignment[];
  extraLessons?: CurriculumLesson[];
};

export function buildStandardFixtureModules({
  courseId,
  moduleTitles,
  introVideoUrl,
  assignments,
  extraLessons = [],
}: StandardCurriculumInput): ModuleWithLessons[] {
  const assignmentByOrder = new Map(assignments.map((a) => [a.sort_order, a]));

  return moduleTitles.map((title, index) => {
    const moduleOrder = index + 1;
    const moduleId = `${courseId}-m${moduleOrder}`;
    const assignment = assignmentByOrder.get(moduleOrder);

    const lessons: Lesson[] = [
      {
        id: `${moduleId}-l1`,
        moduleId,
        title: stripModulePrefix(title),
        lessonType: "video",
        youtubeUrl: moduleOrder === 1 ? introVideoUrl : null,
        content: null,
        durationLabel: null,
        durationMinutes: null,
        order: 1,
        assignments: [],
        quizzes: [],
        createdAt: FIXTURE_TIMESTAMP,
        updatedAt: FIXTURE_TIMESTAMP,
      },
      {
        id: `${moduleId}-l2`,
        moduleId,
        title: "Module resources & downloads",
        lessonType: "resource",
        youtubeUrl: null,
        content: RESOURCE_CONTENT,
        durationLabel: null,
        durationMinutes: null,
        order: 2,
        assignments: [],
        quizzes: [],
        createdAt: FIXTURE_TIMESTAMP,
        updatedAt: FIXTURE_TIMESTAMP,
      },
      ...extraLessons
        .filter((lesson) => lesson.moduleOrder === moduleOrder)
        .map((lesson) => ({
          id: `${moduleId}-l${lesson.sortOrder}`,
          moduleId,
          title: lesson.title,
          lessonType: lesson.lessonType,
          youtubeUrl: lesson.youtubeUrl,
          content: lesson.content ?? null,
          durationLabel: null,
          durationMinutes: null,
          order: lesson.sortOrder,
          assignments: [],
          quizzes: [],
          createdAt: FIXTURE_TIMESTAMP,
          updatedAt: FIXTURE_TIMESTAMP,
        })),
    ];

    const moduleAssignments: Assignment[] = assignment
      ? [
          {
            id: `${moduleId}-assignment`,
            moduleId,
            lessonId: null,
            title: assignment.title,
            description: assignment.description,
            fileUrl: null,
            fileType: null,
            resourceFiles: [],
            createdAt: FIXTURE_TIMESTAMP,
            updatedAt: FIXTURE_TIMESTAMP,
          },
        ]
      : [];

    return {
      id: moduleId,
      courseId,
      title,
      order: moduleOrder,
      createdAt: FIXTURE_TIMESTAMP,
      updatedAt: FIXTURE_TIMESTAMP,
      assignments: moduleAssignments,
      quizzes: [],
      lessons,
    };
  });
}
