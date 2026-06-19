import { SUBMIT_LINE } from "./build-standard-modules.mjs";

export const TEAM_COACH_MODULE_TITLES = [
  [1, "Module 1: Laying the foundation"],
  [2, "Module 2: The Human Potential Tools"],
  [3, "Module 3: Unleashing new insight"],
  [4, "Module 4: Sense Making"],
  [5, "Module 5: Maintaining Momentum"],
  [6, "Module 6: Closing & celebration"],
];

// [moduleSortOrder, title, youtube_url, lesson_type, duration_label, duration_minutes, content, sort_order]
export const TEAM_COACH_LESSONS = [
  [
    1,
    "Creating the optimal conditions for this certification journey",
    "https://youtu.be/2XXFEndXKhE",
    "video",
    "18:55",
    19,
    null,
    1,
  ],

  [2, "The Human Potential Iceberg", "https://youtu.be/0ihlThTOa0U", "video", "22:45", 23, null, 1],
  [
    2,
    "The Maturity Consciousness Model",
    "https://youtu.be/gnttLZKH2D0",
    "video",
    "25:03",
    26,
    null,
    2,
  ],
  [
    2,
    "The 5 Team Measures",
    null,
    "resource",
    null,
    null,
    "Review the five essential Full Potential Team Measures. Video for this topic will be added soon.",
    3,
  ],
  [
    2,
    "The Human Potential House",
    null,
    "resource",
    null,
    null,
    "Study the Human Potential House framework for teams. Video for this topic will be added soon.",
    4,
  ],

  [
    3,
    "Role play — Human Potential House",
    "https://youtu.be/cX3M-PDKhtw",
    "video",
    null,
    null,
    null,
    1,
  ],
  [
    3,
    "Role play — Maturity Consciousness Framework",
    "https://youtu.be/PiTnDjl89K4",
    "video",
    "22:57",
    23,
    null,
    2,
  ],

  [
    4,
    "Moving the team from insight to action",
    "https://youtu.be/2h7QYESAzPE",
    "video",
    "35:37",
    36,
    null,
    1,
  ],

  [
    5,
    "Putting in place a sustainable follow-up plan",
    "https://youtu.be/PsADDe5JE9s",
    "video",
    "19:20",
    20,
    null,
    1,
  ],

  [
    6,
    "Finalizing the certification process",
    "https://youtu.be/yfMvAQQjRpM",
    "video",
    "19:15",
    20,
    null,
    1,
  ],
  [
    6,
    "Program resources & feedback",
    null,
    "resource",
    null,
    null,
    "Access certification resources, feedback forms, and program downloads.",
    2,
  ],
  [
    6,
    "Team Coach certification checklist",
    null,
    "resource",
    null,
    null,
    "Review the certification checklist to confirm you have met all program requirements.",
    3,
  ],
];

/** @type {Array<{ sort_order: number, title: string, description: string }>} */
export const TEAM_COACH_ASSIGNMENTS = [
  {
    sort_order: 1,
    title: "Assignment — Laying the foundation",
    description: `Watch the module video on creating optimal conditions for this certification journey.\n\nIntroduce yourself and the team you will use as a practice case throughout this certification. Capture the team's stated purpose and the conditions you will hold for deep dialogue.\n\n${SUBMIT_LINE}`,
  },
  {
    sort_order: 2,
    title: "Assignment — The Human Potential Tools",
    description: `Watch the videos on the Human Potential Iceberg and the Maturity Consciousness Model.\n\nReview the 5 Team Measures and the Human Potential House materials. Summarize how each tool helps you see team potential more clearly.\n\n${SUBMIT_LINE}`,
  },
  {
    sort_order: 3,
    title: "Assignment — Unleashing new insight",
    description: `Watch both role-play videos for this module.\n\nReflect on what you noticed in yourself and the team during the Human Potential House and Maturity Consciousness role plays. Note two facilitation moves you will apply with your practice team.\n\n${SUBMIT_LINE}`,
  },
  {
    sort_order: 4,
    title: "Assignment — Sense making",
    description: `Watch the module video on moving from insight to action.\n\nDesign a sense-making session outline for your practice team: opening framing, key insights to explore, and how you will land collective commitments.\n\n${SUBMIT_LINE}`,
  },
  {
    sort_order: 5,
    title: "Assignment — Maintaining momentum",
    description: `Watch the module video on sustainable follow-up.\n\nDraft a 90-day follow-up plan for your practice team, including check-in cadence, accountability structures, and how you will keep human potential measures alive.\n\n${SUBMIT_LINE}`,
  },
  {
    sort_order: 6,
    title: "Assignment — Certification & closing",
    description: `Watch the closing module video and complete the certification checklist.\n\nSubmit your feedback form and document your integration plan for bringing Human Potential Team Coaching into your practice.\n\n${SUBMIT_LINE}`,
  },
];

export const TEAM_COACH_CURRICULUM = {
  lessons: TEAM_COACH_LESSONS,
  assignments: TEAM_COACH_ASSIGNMENTS,
};
