import type { LessonType } from "@/types/lms";

type FixtureLesson = {
  title: string;
  youtubeUrl: string | null;
  lessonType: LessonType;
  durationLabel: string | null;
  durationMinutes: number | null;
  content?: string | null;
};

export type FixtureSeedModule = {
  title: string;
  lessons: FixtureLesson[];
};

const MODULE_VIDEOS: Record<number, string> = {
  1: "https://youtu.be/VJ6ct2gPb3E",
  3: "https://youtu.be/xV85xRFUeRw",
  4: "https://youtu.be/OoLwzCRyXNA",
};

const VIDEO_COMING_SOON =
  "Video for this module will be added soon. Complete the reflection exercises in this module's assignment while materials are being prepared.";

const ADDITIONAL_RESOURCES =
  "Complete the reflection exercises and download any worksheets attached to this module's assignment. Additional materials may be added by your facilitator.";

const SUBMIT_LINE =
  "Send your completed work to peter@beingatfullpotential.nz and mark@beingatfullpotential.com, or come prepared to discuss in your cohort session.";

function stripModulePrefix(title: string) {
  return title.replace(/^(Module|Week) \d+:\s*/i, "").trim();
}

function assignmentResources(body: string) {
  return `Additional resources & exercises\n\n${body}\n\n${SUBMIT_LINE}`;
}

const MODULE_TITLES = [
  "Week 1: From Fragmentation to Wholeness — Opening the Journey",
  "Week 2: Developmental Stages and States of Consciousness",
  "Week 3: Building a Developmental Diagnostic",
  "Week 4: Embodying Mature Identity — Holding Paradox and Complexity",
  "Week 5: Cross-Mapping Developmental Models",
  "Week 6: Working from Being — Integration and Practice",
];

export const WHOLENESS_SEED_MODULES: FixtureSeedModule[] = MODULE_TITLES.map(
  (title, index) => {
    const moduleOrder = index + 1;
    const videoUrl = MODULE_VIDEOS[moduleOrder] ?? null;

    return {
      title,
      lessons: [
        {
          title: stripModulePrefix(title),
          youtubeUrl: videoUrl,
          lessonType: "video",
          durationLabel: null,
          durationMinutes: null,
          content: videoUrl ? null : VIDEO_COMING_SOON,
        },
      ],
    };
  },
);

export const WHOLENESS_ASSIGNMENT_SEEDS = [
  {
    title: "Assignment — Opening the journey to wholeness",
    description: assignmentResources(
      `Watch the module video and reflect on where fragmentation shows up in your practice.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    title: "Assignment — Stages and states of consciousness",
    description: assignmentResources(
      `Distinguish developmental stages from states using examples from your practice.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    title: "Assignment — Developmental diagnostic",
    description: assignmentResources(
      `Build a developmental diagnostic for a real client or team.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    title: "Assignment — Mature identity & paradox",
    description: assignmentResources(
      `Describe a live paradox you are holding and how you will embody mature identity.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    title: "Assignment — Cross-mapping developmental models",
    description: assignmentResources(
      `Cross-map one client situation across two developmental models.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    title: "Assignment — Integration & practice plan",
    description: assignmentResources(
      `Document your 90-day plan for bringing wholeness into your coaching and leadership work.\n\nAccess program resources, feedback forms, and supplementary materials.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
];
