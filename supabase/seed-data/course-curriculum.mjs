import { HPCC_LESSONS } from "./hpcc-lessons.mjs";
import { HPCC_MODULE_ASSIGNMENTS } from "./hpcc-module-assignments.mjs";
import { EMPLOYEE_EXPERIENCE_CURRICULUM } from "./employee-experience-curriculum.mjs";
import { TEAM_COACH_CURRICULUM } from "./team-coach-curriculum.mjs";
import { WHOLENESS_CURRICULUM } from "./wholeness-curriculum.mjs";

/** @type {Record<string, { lessons: typeof HPCC_LESSONS, assignments: typeof HPCC_MODULE_ASSIGNMENTS }>} */
export const COURSE_CURRICULUM = {
  "human-potential-coach-certification": {
    lessons: HPCC_LESSONS,
    assignments: HPCC_MODULE_ASSIGNMENTS,
  },
  "human-potential-team-coach-certification": TEAM_COACH_CURRICULUM,
  "breakthroughs-employee-experience": EMPLOYEE_EXPERIENCE_CURRICULUM,
  "from-fragmentation-to-wholeness": WHOLENESS_CURRICULUM,
};

export const CURRICULUM_COURSE_SLUGS = Object.keys(COURSE_CURRICULUM);
