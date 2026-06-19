import { SUBMIT_LINE, stripModulePrefix } from "./build-standard-modules.mjs";

export const WHOLENESS_MODULE_TITLES = [
  [1, "Week 1: From Fragmentation to Wholeness — Opening the Journey"],
  [2, "Week 2: Developmental Stages and States of Consciousness"],
  [3, "Week 3: Building a Developmental Diagnostic"],
  [4, "Week 4: Embodying Mature Identity — Holding Paradox and Complexity"],
  [5, "Week 5: Cross-Mapping Developmental Models"],
  [6, "Week 6: Working from Being — Integration and Practice"],
];

const MODULE_VIDEOS = {
  1: "https://youtu.be/VJ6ct2gPb3E",
  3: "https://youtu.be/xV85xRFUeRw",
  4: "https://youtu.be/OoLwzCRyXNA",
};

const VIDEO_COMING_SOON =
  "Video for this module will be added soon. Complete the reflection exercises in this module's assignment while materials are being prepared.";

const ADDITIONAL_RESOURCES =
  "Complete the reflection exercises and download any worksheets attached to this module's assignment. Additional materials may be added by your facilitator.";

function assignmentResources(body) {
  return `Additional resources & exercises\n\n${body}\n\n${SUBMIT_LINE}`;
}

/** @type {Array<{ sort_order: number, title: string, description: string }>} */
export const WHOLENESS_ASSIGNMENTS = [
  {
    sort_order: 1,
    title: "Assignment — Opening the journey to wholeness",
    description: assignmentResources(
      `Watch the module video and reflect on where fragmentation shows up in your coaching or leadership practice.\n\nWrite a personal narrative: what wholeness would look and feel like for you and your clients.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    sort_order: 2,
    title: "Assignment — Stages and states of consciousness",
    description: assignmentResources(
      `Distinguish developmental stages from states of consciousness using examples from your practice.\n\nIdentify one client or system where confusing stage and state limited your effectiveness—and how you will work differently.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    sort_order: 3,
    title: "Assignment — Developmental diagnostic",
    description: assignmentResources(
      `Build a developmental diagnostic for a real client or team (anonymized).\n\nInclude observable behaviors, likely stage, and the questions you will use to test your hypothesis.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    sort_order: 4,
    title: "Assignment — Mature identity & paradox",
    description: assignmentResources(
      `Describe a live paradox you are holding with a client or in your own development.\n\nHow can you embody mature identity—presence, humility, and clarity—while staying in the tension?\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    sort_order: 5,
    title: "Assignment — Cross-mapping developmental models",
    description: assignmentResources(
      `Cross-map one client situation across two models referenced in this masterclass (e.g. Kegan, Cook-Greuter, Torbert, or Pancha Kosha).\n\nWhat does each model reveal? Where do they converge?\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
  {
    sort_order: 6,
    title: "Assignment — Integration & practice plan",
    description: assignmentResources(
      `Complete the masterclass integration worksheet.\n\nDocument your contemplative or embodiment practices for the next 90 days and how you will bring wholeness into your coaching and leadership work.\n\nAccess program resources, feedback forms, and supplementary materials.\n\n${ADDITIONAL_RESOURCES}`,
    ),
  },
];

// [moduleSortOrder, title, youtube_url, lesson_type, duration_label, duration_minutes, content, sort_order]
export const WHOLENESS_LESSONS = WHOLENESS_MODULE_TITLES.map(([sortOrder, moduleTitle]) => {
  const videoUrl = MODULE_VIDEOS[sortOrder] ?? null;
  const sessionTitle = stripModulePrefix(moduleTitle);

  return [
    sortOrder,
    sessionTitle,
    videoUrl,
    "video",
    null,
    null,
    videoUrl ? null : VIDEO_COMING_SOON,
    1,
  ];
});

export const WHOLENESS_CURRICULUM = {
  lessons: WHOLENESS_LESSONS,
  assignments: WHOLENESS_ASSIGNMENTS,
};
