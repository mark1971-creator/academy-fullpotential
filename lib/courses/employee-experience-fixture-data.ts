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

const ADDITIONAL_RESOURCES_PLACEHOLDER =
  "Complete the reflection exercises and download any worksheets attached to this module's assignment. Additional materials may be added by your facilitator.";

function readingBlock(title: string, body: string) {
  return `${title}\n\n${body}`;
}

const INTRO_ABOVE_VIDEO = readingBlock(
  "We must shift the way we think about Employee Experience",
  `HR leaders are increasingly talking about the importance of Employee Experience as the key to organizational breakthroughs. According to a recent Gartner study, it is the 3rd priority after Leader & Manager Effectiveness and Change Readiness. Placing the employee's wellbeing at the center has led to an explosion of health programs, equity & inclusion initiatives, flex work schedules and many other workplace improvements. These are all necessary and important investments but are they sufficient to address the fact that still only 13% of employees are fully satisfied with their employment experience? It seems there are some missing pieces to solving the Employee Experience puzzle.`,
);

const INTRO_ASSIGNMENT_RESOURCES = `Today's workforce (especially the younger generation) yearns and seeks higher-order or deeper (more profound) meaning, purpose, and impact by being able to contribute their natural gifts and talents creatively at work. But current programs and initiatives to improve employee experience are designed to meet 'basic' security and explicit/external emotional needs. Despite these improvements, most organizations still cannot fully satisfy this inner yearning of employees for their higher-order needs today, namely the growth needs of human beings for self-actualization (for example, being true to yourself, expressing our creativity, making a positive difference in the world, and achieving inner happiness at work).`;

const TRUST_ABOVE_VIDEO = readingBlock(
  "Acknowledging what it feels like to be an employee today",
  `Employees are feeling pain from being unable to become the best of themselves and who they are as a human person in the work environment. Instead, employees experience a lot of tension and conflicts from all the changes happening inside and outside the organization and in their lives. This is revealed in Gartner's research showing that only 13% of employees are fully satisfied with their experience at work.

In this training course, we offer employees (you) a proven way with new language and structure to understand how to lessen and overcome those pain (e.g., uninspired, unfulfilled, unsatisfied, angry, resignation, etc.) and gain a more positive employee experience (e.g., excitement, happiness, gratitude, joy, flow, peak experiences, etc.) at work. Employees will come to understand why is it that they are not fully satisfied and feel unsettled at work. We will build a safe and trustworthy relationship with you in this training as we embark on this inner developmental work.`,
);

const TRUST_ASSIGNMENT_RESOURCES = `Employees feel pain from being unable to express themselves in the work environment fully. Instead, employees experience a lot of tension and conflicts from all the changes happening inside and outside the organization and in their lives. This is revealed in Gartner's research showing that only 13% of employees are fully satisfied with their experience at work.`;

const DOWNLOAD_ABOVE_VIDEO = readingBlock(
  "Inventorizing your current experience of work",
  `This module is about downloading how we are experiencing work today – without any filters. It's about working with just the raw and transparent account of the pain and dissatisfaction you experience deep inside you when you feel dissatisfied with your employee experience at work.`,
);

const BEING_ABOVE_VIDEO = readingBlock(
  "Introducing the BEING and how it has the power to shift our experience at work",
  `At this part of the training, we invite you to be aware and conscious that your employee experience is essentially a human experience. From this vantage and fundamental point, you will begin to see that you exist in this world as a human person, in relationships with every other person in the world. What this fundamentally means is that you exist – you are a unique existing person – your experience and living life every moment in the world is literally through BEING who you are and "BEING who is there" in this world at work or in life.`,
);

const BEING_ASSIGNMENT_RESOURCES = `At this part of the training, we invite you to be aware and conscious that your employee experience is essentially a human experience. From this vantage and fundamental point, you begin to realize that your happiness & fulfillment is a function of your inner state (what we refer to as Being) rather than the decisions made by "management" or the HR leaders. This fundamentally means that you exist – you are a unique human being, taking every opportunity (challenging as they may be) to shift your perspective and express more and more of who you are.`;

const PRACTICAL_VERTICAL = readingBlock(
  "Vertical vs horizontal development",
  `This module is the first of three-part videos that introduce practical and actionable tools and frameworks that helps you to navigate how you can choose to experience work with a higher level of consciousness maturity. It invites you to a new way of deep learning and thinking about how you interact as human Beings in relationships with your colleagues as human Beings – it's a human-to-human experience rather than an employee-to-employee experience. It is a fresh and mature way of understanding and thinking about your Being and Doing.`,
);

const PRACTICAL_CONSCIOUSNESS = readingBlock(
  "Consciousness maturity",
  `Essentially, as human beings, we all yearn to grow, develop, and evolve – the will to live, grow, and create is part of our human DNA. Becoming a mature adult means transitioning to higher stages of human development and it happens primarily through our engagement in vertical learning or development, not only through horizontal development, but it must also include vertical learning or development. Then, as adults, we continue to develop throughout our entire adult life – it is a lifelong journey.`,
);

const PRACTICAL_PORTAL = readingBlock(
  "Portal for Human Potential Development",
  "Explore the Portal for Human Potential Development and how it supports vertical growth and self-actualization through work.",
);

const CLOSING_ABOVE_VIDEO = readingBlock(
  "Where to go from here",
  "Reflect on your journey through this program and identify your next steps for sustaining breakthroughs in your employee experience and supporting others in your organization.",
);

function assignmentResources(body: string) {
  return `Additional resources & exercises\n\n${body}`;
}

export const EMPLOYEE_EXPERIENCE_SEED_MODULES: FixtureSeedModule[] = [
  {
    title: "Introduction: Why this course is needed",
    lessons: [
      {
        title: "Introduction: Why this course is needed",
        youtubeUrl: "https://youtu.be/B1XoMBrd2tA",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: INTRO_ABOVE_VIDEO,
      },
    ],
  },
  {
    title: "Getting started",
    lessons: [
      {
        title: "How to get the most out of this course",
        youtubeUrl: "https://youtu.be/aL05WZgBrT8",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content:
          "Review how this program is structured, what to expect in each module, and how to engage with videos, reflections, and assignments for the fullest learning experience.",
      },
    ],
  },
  {
    title: "Module 1: Creating trust & credibility",
    lessons: [
      {
        title: "Creating trust & credibility",
        youtubeUrl: "https://youtu.be/cnfSGFo7ZHs",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: TRUST_ABOVE_VIDEO,
      },
    ],
  },
  {
    title: "Module 2: Downloading our dissatisfaction",
    lessons: [
      {
        title: "Downloading our dissatisfaction",
        youtubeUrl: "https://youtu.be/-Pv51SrU49M",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: DOWNLOAD_ABOVE_VIDEO,
      },
    ],
  },
  {
    title: 'Module 3: Shifting our ways of "BEING"',
    lessons: [
      {
        title: 'Shifting our ways of "BEING"',
        youtubeUrl: "https://youtu.be/3eCDR0cLZe8",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: BEING_ABOVE_VIDEO,
      },
    ],
  },
  {
    title: "Module 4: Making it practical",
    lessons: [
      {
        title: "Vertical vs horizontal development",
        youtubeUrl: "https://youtu.be/iHEKlvPMYU4",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: PRACTICAL_VERTICAL,
      },
      {
        title: "Consciousness maturity",
        youtubeUrl: "https://youtu.be/D_bCZ9RNaK0",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: PRACTICAL_CONSCIOUSNESS,
      },
      {
        title: "Portal for Human Potential Development",
        youtubeUrl: "https://youtu.be/Cw6md8qu-Vc",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: PRACTICAL_PORTAL,
      },
    ],
  },
  {
    title: "Closing & next steps",
    lessons: [
      {
        title: "Closing & next steps",
        youtubeUrl: "https://youtu.be/ojxbzgF2RiI",
        lessonType: "video",
        durationLabel: null,
        durationMinutes: null,
        content: CLOSING_ABOVE_VIDEO,
      },
    ],
  },
];

export const EMPLOYEE_EXPERIENCE_ASSIGNMENT_SEEDS = [
  {
    title: "Assignment — Why this course matters",
    description: assignmentResources(INTRO_ASSIGNMENT_RESOURCES),
  },
  {
    title: "Assignment — Getting started",
    description:
      'Watch "How to get the most out of this course" and outline your learning goals for this program.',
  },
  {
    title: "Assignment — Creating trust & credibility",
    description: assignmentResources(TRUST_ASSIGNMENT_RESOURCES),
  },
  {
    title: "Assignment — Downloading our dissatisfaction",
    description: assignmentResources(ADDITIONAL_RESOURCES_PLACEHOLDER),
  },
  {
    title: 'Assignment — Shifting our ways of "BEING"',
    description: assignmentResources(BEING_ASSIGNMENT_RESOURCES),
  },
  {
    title: "Assignment — Making it practical",
    description: assignmentResources(ADDITIONAL_RESOURCES_PLACEHOLDER),
  },
  {
    title: "Assignment — Closing & integration",
    description: assignmentResources(ADDITIONAL_RESOURCES_PLACEHOLDER),
  },
];
