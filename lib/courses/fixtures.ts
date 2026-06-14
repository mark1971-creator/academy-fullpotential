import type {
  Course,
  CourseWithCurriculum,
  LessonType,
  ModuleWithLessons,
} from "@/types/lms";

/**
 * Local development fallback data.
 *
 * Mirrors `supabase/seed.sql` for the Human Potential Coach Certification course.
 * This is ONLY used when the Supabase database is unreachable in development
 * (see `getCourseWithCurriculumBySlug` and friends in `lib/actions/courses.ts`),
 * so the UI can still be built and reviewed without a live backend.
 *
 * It is never used in production — fix `NEXT_PUBLIC_SUPABASE_URL` / keys instead.
 */

const FIXTURE_TIMESTAMP = "2026-01-01T00:00:00.000Z";
/** Prefix for every fixture-generated id, used to detect fallback data at render time. */
export const FIXTURE_ID_PREFIX = "fixture-";
const FIXTURE_COURSE_ID = `${FIXTURE_ID_PREFIX}hpcc`;
const FIXTURE_SLUG = "human-potential-coach-certification";

/** Returns true when an entity originated from the local development fallback fixtures. */
export function isFixtureData(entity: { id: string } | null | undefined): boolean {
  return Boolean(entity?.id.startsWith(FIXTURE_ID_PREFIX));
}

type SeedLesson = {
  title: string;
  youtubeUrl: string | null;
  lessonType: LessonType;
  durationLabel: string | null;
  durationMinutes: number | null;
  content?: string | null;
};

type SeedModule = {
  title: string;
  lessons: SeedLesson[];
};

const SEED_MODULES: SeedModule[] = [
  {
    title: "Module 1: Authentic introductions",
    lessons: [
      {
        title: "Getting to know each other & creating a BEING space",
        youtubeUrl: "https://youtu.be/2XXFEndXKhE",
        lessonType: "video",
        durationLabel: "18:55",
        durationMinutes: 19,
      },
    ],
  },
  {
    title: "Module 2: Context for Human Potential interventions",
    lessons: [
      {
        title: "Understanding why deeper human-centric interventions are needed",
        youtubeUrl: "https://youtu.be/POa-Ksk-FqU",
        lessonType: "video",
        durationLabel: "17:12",
        durationMinutes: 18,
      },
      {
        title: "Connecting with the emerging need",
        youtubeUrl: "https://youtu.be/XtXs-qjxhrk",
        lessonType: "video",
        durationLabel: "15:55",
        durationMinutes: 16,
      },
      {
        title: "Filling the void",
        youtubeUrl: "https://youtu.be/XZakH2-ne_U",
        lessonType: "video",
        durationLabel: "14:53",
        durationMinutes: 15,
      },
    ],
  },
  {
    title: "Module 3: The Human Potential Iceberg",
    lessons: [
      {
        title: "Introduction to the Human Potential Iceberg",
        youtubeUrl: "https://youtu.be/GGPuqlP83LA",
        lessonType: "video",
        durationLabel: "24:01",
        durationMinutes: 25,
      },
      {
        title: "Deep dive into the 6 Organizational Performance Metrics (OPM's)",
        youtubeUrl: "https://youtu.be/0ihlThTOa0U",
        lessonType: "video",
        durationLabel: "22:45",
        durationMinutes: 23,
      },
    ],
  },
  {
    title: "Module 4: Using the 6 OPM's to build bridges into the client's reality",
    lessons: [
      {
        title: "OPM role play",
        youtubeUrl: "https://youtu.be/2ST4TJPnOZA",
        lessonType: "video",
        durationLabel: "26:59",
        durationMinutes: 27,
      },
      {
        title: "OPM role play - Best practices",
        youtubeUrl: "https://youtu.be/e9Cn2F7g-5w",
        lessonType: "video",
        durationLabel: "24:51",
        durationMinutes: 25,
      },
    ],
  },
  {
    title: "Module 5: Understanding the Human Potential House",
    lessons: [
      {
        title: "The origins of the Human Potential House",
        youtubeUrl: "https://youtu.be/e1WQoNM6dmU",
        lessonType: "video",
        durationLabel: "21:50",
        durationMinutes: 22,
      },
      {
        title: "Working with the Human Potential House",
        youtubeUrl: "https://youtu.be/rEqJdrsEPew",
        lessonType: "video",
        durationLabel: "22:28",
        durationMinutes: 23,
      },
    ],
  },
  {
    title:
      "Module 6: Using the 4 States and 23 Dimensions to uncover deeper insight into the client's reality",
    lessons: [
      {
        title: "Debriefing the Human Potential House Role Play",
        youtubeUrl: "https://youtu.be/cX3M-PDKhtw",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
      },
      {
        title: "Deep dive into the 4 States & 23 Dimensions",
        youtubeUrl: "https://youtu.be/aowvAT8brYg",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
      },
    ],
  },
  {
    title: "Module 7: The 8 Being Attitudes",
    lessons: [
      {
        title: "Deep dive into the 8 Being Attitudes",
        youtubeUrl: "https://youtu.be/teu9XlnkOYQ",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
      },
    ],
  },
  {
    title: "Module 8: Consciousness Maturity Index",
    lessons: [
      {
        title: "Understanding the 5 levels of maturity and consciousness",
        youtubeUrl: "https://youtu.be/yWjAr7TAdDk",
        lessonType: "video",
        durationLabel: "24:44",
        durationMinutes: 25,
      },
      {
        title: "Applying of maturity consciousness model",
        youtubeUrl: "https://youtu.be/gnttLZKH2D0",
        lessonType: "video",
        durationLabel: "25:03",
        durationMinutes: 26,
      },
      {
        title: "Using the Maturity framework to connect with our clients - role play",
        youtubeUrl: "https://youtu.be/PiTnDjl89K4",
        lessonType: "video",
        durationLabel: "22:57",
        durationMinutes: 23,
      },
    ],
  },
  {
    title: "Module 9: Additional findings",
    lessons: [
      {
        title: "Clarifying all remaining parts of the Human Potential report",
        youtubeUrl: "https://youtu.be/TGZiz5faZO0",
        lessonType: "video",
        durationLabel: "21:28",
        durationMinutes: 22,
      },
    ],
  },
  {
    title: "Module 10: Debriefing clients on their full report",
    lessons: [
      {
        title: "Part 1: Bringing it all to life with full assessment debrief",
        youtubeUrl: "https://youtu.be/2h7QYESAzPE",
        lessonType: "video",
        durationLabel: "35:37",
        durationMinutes: 36,
      },
      {
        title: "Part 2: Lessons and best practices from full HP assessment debrief",
        youtubeUrl: "https://youtu.be/mJ9Ao4mBPEM",
        lessonType: "video",
        durationLabel: "15:05",
        durationMinutes: 16,
      },
    ],
  },
  {
    title: "Module 11: Closing, next steps & certification",
    lessons: [
      {
        title: "Part 1: Synchronizing individual and collective purpose",
        youtubeUrl: "https://youtu.be/PsADDe5JE9s",
        lessonType: "video",
        durationLabel: "19:20",
        durationMinutes: 20,
      },
      {
        title: "Part 2: Being at Full Potential vision, mission and standards",
        youtubeUrl: "https://youtu.be/NsS3h8nR0E4",
        lessonType: "video",
        durationLabel: "19:59",
        durationMinutes: 20,
      },
      {
        title: "Part 3: Next steps",
        youtubeUrl: "https://youtu.be/yfMvAQQjRpM",
        lessonType: "video",
        durationLabel: "19:15",
        durationMinutes: 20,
      },
      {
        title: "Resources & feedback form",
        youtubeUrl: null,
        lessonType: "resource",
        durationLabel: null,
        durationMinutes: null,
        content: "Access program resources and submit your training feedback.",
      },
      {
        title: "Certification check list",
        youtubeUrl: null,
        lessonType: "resource",
        durationLabel: null,
        durationMinutes: null,
        content:
          "Review the certification checklist to confirm you have met all program requirements.",
      },
    ],
  },
];

const modules: ModuleWithLessons[] = SEED_MODULES.map((seedModule, moduleIndex) => {
  const moduleOrder = moduleIndex + 1;
  const moduleId = `${FIXTURE_COURSE_ID}-m${moduleOrder}`;

  return {
    id: moduleId,
    courseId: FIXTURE_COURSE_ID,
    title: seedModule.title,
    order: moduleOrder,
    createdAt: FIXTURE_TIMESTAMP,
    updatedAt: FIXTURE_TIMESTAMP,
    assignments: [],
    quizzes: [],
    lessons: seedModule.lessons.map((seedLesson, lessonIndex) => {
      const lessonOrder = lessonIndex + 1;
      return {
        id: `${moduleId}-l${lessonOrder}`,
        moduleId,
        title: seedLesson.title,
        lessonType: seedLesson.lessonType,
        youtubeUrl: seedLesson.youtubeUrl,
        content: seedLesson.content ?? null,
        durationLabel: seedLesson.durationLabel,
        durationMinutes: seedLesson.durationMinutes,
        order: lessonOrder,
        assignments: [],
        quizzes: [],
        createdAt: FIXTURE_TIMESTAMP,
        updatedAt: FIXTURE_TIMESTAMP,
      };
    }),
  };
});

export const HPCC_FIXTURE_COURSE: CourseWithCurriculum = {
  id: FIXTURE_COURSE_ID,
  title: "Certification – Human Potential Development Coach Training",
  description:
    "Welcome and thank you for enrolling for this certification training. If you work with leaders, teams & organizations you will probably agree that much of our Human Potential remains dormant or unexpressed in the work environment. This program equips you to debrief assessments, build business cases for human potential development, and guide transformational client work.",
  slug: FIXTURE_SLUG,
  thumbnailUrl: null,
  heroVideoUrl: null,
  durationLabel: "24 hours",
  level: "Expert",
  rating: 5.0,
  ratingCount: 10,
  enrolledCount: 86,
  whatYouWillLearn: [
    "Debrief the Human Potential assessment with your clients",
    "Clearly demonstrate how a greater focus on HUMAN POTENTIAL REALIZATION drives key business metrics such as: employee engagement, trustworthiness & innovation",
    "Offer very concrete tools and methodologies that bring more objectivity to the subjective nature of human beings",
    "Make a robust business case for HUMAN POTENTIAL DEVELOPMENT and expand your effectiveness in OD work",
    "Inspire your clients to bring more focus and attention on the HUMAN DIMENSION in their organizations",
    "Gain insights that will allow you to access even more of your human potential and grow into your next stage of personal development in life",
  ],
  tags: [
    "Coaching",
    "Conscious Culture",
    "Human Potential",
    "Leadership development",
    "Organizational development",
    "Personal development",
  ],
  price: 995.0,
  isPublished: true,
  createdAt: FIXTURE_TIMESTAMP,
  updatedAt: FIXTURE_TIMESTAMP,
  modules,
};

const FIXTURE_COURSES_WITH_CURRICULUM: CourseWithCurriculum[] = [HPCC_FIXTURE_COURSE];

function toCourse(course: CourseWithCurriculum): Course {
  const { modules: _modules, ...rest } = course;
  void _modules;
  return rest;
}

export function getFixtureCourses(): Course[] {
  return FIXTURE_COURSES_WITH_CURRICULUM.map(toCourse);
}

export function getFixtureCourseBySlug(slug: string): Course | null {
  const match = FIXTURE_COURSES_WITH_CURRICULUM.find((course) => course.slug === slug);
  return match ? toCourse(match) : null;
}

export function getFixtureCourseWithCurriculumBySlug(
  slug: string,
): CourseWithCurriculum | null {
  return FIXTURE_COURSES_WITH_CURRICULUM.find((course) => course.slug === slug) ?? null;
}
