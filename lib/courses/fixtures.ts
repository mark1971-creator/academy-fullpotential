import type {
  Course,
  CoursePreview,
  CourseWithCurriculum,
  Lesson,
  LessonType,
  ModuleWithLessons,
} from "@/types/lms";
import {
  PLACEHOLDER_LESSON_CONTENT,
  buildPlaceholderLessonTitle,
} from "@/lib/courses/placeholders";
import { prepareCoursesForCatalog } from "@/lib/courses/catalog-order";
import { getCourseIntroVideoUrl } from "@/lib/courses/course-intro-videos";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";

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

function createFixtureModules(
  courseId: string,
  titles: string[],
  options?: { placeholderLessons?: boolean },
): ModuleWithLessons[] {
  return titles.map((title, index) => {
    const moduleOrder = index + 1;
    const moduleId = `${courseId}-m${moduleOrder}`;
    const lessons =
      options?.placeholderLessons === true
        ? [
            {
              id: `${moduleId}-placeholder`,
              moduleId,
              title: buildPlaceholderLessonTitle(title),
              lessonType: "resource" as LessonType,
              youtubeUrl: null,
              content: PLACEHOLDER_LESSON_CONTENT,
              durationLabel: null,
              durationMinutes: null,
              order: 1,
              assignments: [],
              quizzes: [],
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
      assignments: [],
      quizzes: [],
      lessons,
    };
  });
}

function createPreviewFixtureCourse(config: {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  durationLabel: string;
  level: string;
  rating: number;
  ratingCount: number;
  enrolledCount: number;
  whatYouWillLearn: string[];
  whoThisIsFor: string[];
  tags: string[];
  moduleTitles: string[];
  placeholderLessons?: boolean;
  heroVideoUrl?: string | null;
}): CourseWithCurriculum {
  return {
    id: config.id,
    slug: config.slug,
    title: config.title,
    tagline: config.tagline,
    description: config.description,
    thumbnailUrl: `/Images/courses/${config.slug}.webp`,
    heroVideoUrl: config.heroVideoUrl ?? getCourseIntroVideoUrl(config.slug),
    durationLabel: config.durationLabel,
    level: config.level,
    rating: config.rating,
    ratingCount: config.ratingCount,
    enrolledCount: config.enrolledCount,
    whatYouWillLearn: config.whatYouWillLearn,
    whoThisIsFor: config.whoThisIsFor,
    testimonials: [],
    tags: config.tags,
    price: config.price,
    isPublished: true,
    createdAt: FIXTURE_TIMESTAMP,
    updatedAt: FIXTURE_TIMESTAMP,
    modules: createFixtureModules(config.id, config.moduleTitles, {
      placeholderLessons: config.placeholderLessons,
    }),
  };
}

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
  const assignmentSeed = [
    { title: "Assignment — Authentic introductions", description: "Complete the attached authentic introduction template and share your presentation back with Peter and Mark. Your presentation can be in the form of video, story telling or any other creative way you would like to present yourself. Send your completed assignment sheet to: peter@beingatfullpotential.nz and mark@beingatfullpotential.com\n\nIf you are participating in a group course on Zoom then simply come prepared to present yourself during the first session." },
    { title: "Assignment — Context for Human Potential interventions", description: "Watch the 3 videos related to the context for Human Potential Realization.\n\nRead \"Leading Evolutionary Change\" and the \"Cynefin Model\" paper in the attachment.\n\nComplete the quiz related to this paper.\n\nSet up 1-1 with Peter or Mark to review first 2 assignments (peter@beingatfullpotential.nz and mark@beingatfullpotential.com).\n\nIf you are participating in a group course on Zoom then simply come prepared to discuss this module." },
    { title: "Assignment — The Human Potential Iceberg", description: "Watch both videos for this module.\n\nCreate YOUR storyline for each of the OPM's using the attached template.\n\nTake the Human Potential Assessment & print out your report.\n\nTAKE THE HUMAN POTENTIAL ASSESSMENT\n\nSend your completed assignment sheet to: peter@beingatfullpotential.nz and mark@beingatfullpotential.com or, if you are participating in a group course on Zoom, then simply come prepared to discuss during the session." },
    { title: "Assignment — Building bridges into the client's reality", description: "Complete the OPM role-play reflection and document best practices for your next debrief." },
    { title: "Assignment — The Human Potential House", description: "Draft talking points to introduce the Human Potential House to a leader or team." },
    { title: "Assignment — 4 States and 23 Dimensions", description: "Capture insights from the debrief role play on States and Dimensions." },
    { title: "Assignment — The 8 Being Attitudes", description: "Select two Being Attitudes to embody in your next client engagement." },
    { title: "Assignment — Consciousness Maturity Index", description: "Reflect on the maturity consciousness model and role-play exercise." },
    { title: "Assignment — Additional findings", description: "Summarize additional findings you would highlight in a full assessment debrief." },
    { title: "Assignment — Full report debrief", description: "Outline your approach for a 60-minute full assessment debrief session." },
    { title: "Assignment — Certification & next steps", description: "Complete the certification checklist and document your 90-day integration plan." },
  ][moduleIndex];

  return {
    id: moduleId,
    courseId: FIXTURE_COURSE_ID,
    title: seedModule.title,
    order: moduleOrder,
    createdAt: FIXTURE_TIMESTAMP,
    updatedAt: FIXTURE_TIMESTAMP,
    assignments: assignmentSeed
      ? [
          {
            id: `${moduleId}-assignment`,
            title: assignmentSeed.title,
            description: assignmentSeed.description,
            fileUrl: null,
            fileType: null,
            resourceFiles: [],
            lessonId: null,
            moduleId,
            createdAt: FIXTURE_TIMESTAMP,
            updatedAt: FIXTURE_TIMESTAMP,
          },
        ]
      : [],
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
  tagline:
    "Equip yourself to unlock human potential in leaders, teams, and organizations.",
  description:
    "Welcome and thank you for enrolling for this certification training. If you work with leaders, teams & organizations you will probably agree that much of our Human Potential remains dormant or unexpressed in the work environment. This program equips you to debrief assessments, build business cases for human potential development, and guide transformational client work.",
  slug: FIXTURE_SLUG,
  thumbnailUrl: "/Images/courses/human-potential-coach-certification.webp",
  heroVideoUrl: getCourseIntroVideoUrl(FIXTURE_SLUG),
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
  whoThisIsFor: [
    "Coaches and consultants working with leaders, teams, and organizations",
    "HR and organizational development professionals seeking human-centric interventions",
    "Leaders committed to bringing the human dimension into their work",
    "Practitioners ready to debrief Human Potential assessments with clients",
  ],
  testimonials: HPCC_TESTIMONIALS,
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

const FIXTURE_COURSES_WITH_CURRICULUM: CourseWithCurriculum[] = [
  HPCC_FIXTURE_COURSE,
  createPreviewFixtureCourse({
    id: `${FIXTURE_ID_PREFIX}team-coach`,
    slug: "human-potential-team-coach-certification",
    title: "Human Potential Team Coach Certification Training",
    tagline:
      "Become a Certified Human Potential Team Coach and unlock team potential using our proven assessment tools and methodologies.",
    description:
      "This training equips coaches and facilitators to support teams in unleashing their full human potential in service of a common goal.",
    price: 0,
    durationLabel: "20 hours",
    level: "Expert",
    rating: 5.0,
    ratingCount: 8,
    enrolledCount: 42,
    whatYouWillLearn: [
      "Master Human Potential assessment tools for teams",
      "Facilitate transformational team conversations",
      "Anchor the 5 essential team measures",
      "Combine powerful facilitation techniques with human potential data",
      "Drive breakthroughs in team collaboration and performance",
    ],
    whoThisIsFor: [
      "Team coaches",
      "Internal facilitators and change agents",
      "Leaders working with teams",
      "OD professionals",
      "Anyone facilitating group transformation",
    ],
    tags: [
      "Team coaching",
      "Human Potential",
      "Facilitation",
      "Organizational development",
      "Group transformation",
    ],
    moduleTitles: [
      "Module 1: Introduction to Team Human Potential",
      "Module 2: The Human Potential Team Assessment Framework",
      "Module 3: The 5 Essential Team Measures",
      "Module 4: Assessment Debriefing for Teams",
      "Module 5: Transformational Team Facilitation",
      "Module 6: Integrating Data with Facilitation Techniques",
      "Module 7: Driving Breakthroughs in Team Performance",
      "Module 8: Certification, Practice & Next Steps",
    ],
    placeholderLessons: true,
  }),
  createPreviewFixtureCourse({
    id: `${FIXTURE_ID_PREFIX}employee-experience`,
    slug: "breakthroughs-employee-experience",
    title: "Creating Breakthroughs in Employee Experience",
    tagline:
      "Transform employee engagement by focusing on human potential realization and workplace actualization.",
    description:
      "Help employees discover pathways to self-actualization through their work and take greater responsibility for their experience with the organization.",
    price: 0,
    durationLabel: "16 hours",
    level: "Advanced",
    rating: 4.9,
    ratingCount: 12,
    enrolledCount: 58,
    whatYouWillLearn: [
      "Design modern, meaningful employee experiences",
      "Drive breakthroughs in engagement and innovation",
      "Implement human potential development in organizations",
      "Create cultures of self-actualization",
      "Measure and improve key EX metrics",
    ],
    whoThisIsFor: [
      "HR leaders",
      "People & Culture professionals",
      "Managers and team leaders",
      "Internal coaches and facilitators",
      "Change agents focused on employee experience",
    ],
    tags: [
      "Employee experience",
      "Human Potential",
      "Engagement",
      "People & Culture",
      "Organizational development",
    ],
    moduleTitles: [
      "Module 1: The Case for Human Potential in Employee Experience",
      "Module 2: Mapping the Employee Experience Journey",
      "Module 3: Self-Actualization Through Work",
      "Module 4: Designing Breakthrough EX Interventions",
      "Module 5: Building Cultures of Engagement and Innovation",
      "Module 6: Human Potential Development in Organizations",
      "Module 7: Measuring and Improving EX Metrics",
      "Module 8: Implementation and Sustaining Change",
    ],
    placeholderLessons: true,
  }),
  createPreviewFixtureCourse({
    id: `${FIXTURE_ID_PREFIX}wholeness`,
    slug: "from-fragmentation-to-wholeness",
    title: "From Fragmentation to Wholeness – Consciousness Development Masterclass",
    tagline: "The edge isn't more tools or skills. It's more you!",
    description:
      "Grow your consciousness into a mature identity — from overload and fragmentation to coherent, whole-self coaching and leadership.",
    price: 0,
    durationLabel: "6 weeks",
    level: "Masterclass",
    rating: 5.0,
    ratingCount: 6,
    enrolledCount: 24,
    whatYouWillLearn: [
      "Understand developmental stages and states of consciousness",
      "Build a sharper developmental diagnostic",
      "Embody mature identity that holds paradox and complexity",
      "Cross-map Kegan, Cook-Greuter, Torbert and Pancha Kosha models",
      "Work from deeper being for clearer knowing and acting",
    ],
    whoThisIsFor: [
      "Experienced transformational coaches",
      "Leadership development professionals",
      "Facilitators of complexity and systems change",
      "Practitioners with meditation or contemplative practices",
    ],
    tags: [
      "Consciousness development",
      "Masterclass",
      "Coaching",
      "Leadership",
      "Contemplative practice",
    ],
    moduleTitles: [
      "Week 1: From Fragmentation to Wholeness — Opening the Journey",
      "Week 2: Developmental Stages and States of Consciousness",
      "Week 3: Building a Developmental Diagnostic",
      "Week 4: Embodying Mature Identity — Holding Paradox and Complexity",
      "Week 5: Cross-Mapping Developmental Models",
      "Week 6: Working from Being — Integration and Practice",
    ],
    placeholderLessons: true,
  }),
  createPreviewFixtureCourse({
    id: `${FIXTURE_ID_PREFIX}idg-coach`,
    slug: "idg-coach-certification",
    title: "6-Week IDG Coach Certification Training",
    tagline: "If you can measure it, you can manage it.",
    description:
      "This certification training equips you with a powerful IDG Measurement Tool and associated coaching modalities to bring objectivity and action-ability to Inner Development work — especially in organizational contexts. Support leaders on their inner journey and quantify impact toward the 17 SDGs.",
    price: 995,
    durationLabel: "6 weeks",
    level: "Certification",
    rating: 5.0,
    ratingCount: 9,
    enrolledCount: 36,
    whatYouWillLearn: [
      "Administer the IDG Measurement Tool and help clients interpret results",
      "Create highly customized development plans based on assessment data",
      "Demonstrate how Inner Development drives business metrics and SDGs",
      "Add powerful techniques for creating psychologically safe environments",
      "Join a global community of IDG coaches for ongoing growth",
    ],
    whoThisIsFor: [
      "Change agents and sustainability champions in organizations",
      "Coaches and consultants seeking measurable inner development methods",
      "Leaders who want to bring rigor to inner development work",
      "Anyone wanting to demonstrate the business and SDG impact of inner development",
    ],
    tags: ["IDG", "Inner Development", "SDGs", "Coaching", "Certification"],
    moduleTitles: [
      "Week 1: Foundations of Inner Development Goals",
      "Week 2: Mastering the IDG Measurement Tool – Administration",
      "Week 3: Interpreting Results and Creating Development Plans",
      "Week 4: Coaching Techniques and Psychologically Safe Environments",
      "Week 5: Organizational Application and SDG Impact Measurement",
      "Week 6: Integration, Certification and Community Practice",
    ],
    placeholderLessons: true,
  }),
];

function toCourse(course: CourseWithCurriculum): Course {
  const { modules: _modules, ...rest } = course;
  void _modules;
  return rest;
}

export function getFixtureCourses(): Course[] {
  return prepareCoursesForCatalog(FIXTURE_COURSES_WITH_CURRICULUM.map(toCourse));
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

export function getFixtureCoursePreviewBySlug(slug: string): CoursePreview | null {
  const course = getFixtureCourseWithCurriculumBySlug(slug);
  if (!course) return null;

  const { modules, ...rest } = course;
  return {
    ...rest,
    modules: modules.map(({ lessons, assignments, quizzes, ...module }) => {
      void assignments;
      void quizzes;
      return {
        ...module,
        lessonCount: lessons.length,
      };
    }),
  };
}
