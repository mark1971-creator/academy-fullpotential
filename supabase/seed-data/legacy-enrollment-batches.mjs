import { HPCC_LEGACY_ENROLLEES } from "./hpcc-legacy-enrollees.mjs";
import { EMPLOYEE_EXPERIENCE_LEGACY_ENROLLEES } from "./employee-experience-legacy-enrollees.mjs";

/** @typedef {{ full_name: string, email: string }} LegacyEnrollee */

/** @typedef {{ courseSlug: string, enrolledAt: string, enrollees: LegacyEnrollee[] }} LegacyEnrollmentBatch */

/** @type {LegacyEnrollmentBatch[]} */
export const LEGACY_ENROLLMENT_BATCHES = [
  {
    courseSlug: "human-potential-coach-certification",
    enrolledAt: "2024-06-01T00:00:00.000Z",
    enrollees: HPCC_LEGACY_ENROLLEES,
  },
  {
    courseSlug: "breakthroughs-employee-experience",
    enrolledAt: "2026-03-01T00:00:00.000Z",
    enrollees: EMPLOYEE_EXPERIENCE_LEGACY_ENROLLEES,
  },
];
