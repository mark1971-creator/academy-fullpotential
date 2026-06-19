/**
 * Builds HPCC-style module curriculum: module video + resources lesson (+ optional extras on final module).
 * YouTube URLs can be null until videos are uploaded — the player shows a ready placeholder.
 */

const SUBMIT_LINE =
  "Send your completed work to peter@beingatfullpotential.nz and mark@beingatfullpotential.com, or come prepared to discuss in your cohort session.";

const RESOURCE_CONTENT =
  "Download worksheets, guides, and reference materials for this module. Use the assignment downloads when available, or check back as your facilitator adds files.";

/** @param {string} title */
export function stripModulePrefix(title) {
  return title.replace(/^(Module|Week) \d+:\s*/i, "").trim();
}

/**
 * @param {object} options
 * @param {Array<[number, string]>} options.moduleTitles
 * @param {string | null} [options.introVideoUrl]
 * @param {Array<{ sort_order: number, title: string, description: string }>} options.assignments
 * @param {Array<[number, string, string | null, string, string | null, number | null, string | null, number]>} [options.extraLessons]
 */
export function buildModuleCurriculum({ moduleTitles, introVideoUrl = null, assignments, extraLessons = [] }) {
  /** @type {typeof import('./hpcc-lessons.mjs').HPCC_LESSONS} */
  const lessons = [...extraLessons];

  for (const [sortOrder, moduleTitle] of moduleTitles) {
    const sessionTitle = stripModulePrefix(moduleTitle);
    const videoUrl = sortOrder === 1 ? introVideoUrl : null;

    lessons.push([sortOrder, sessionTitle, videoUrl, "video", null, null, null, 1]);
    lessons.push([
      sortOrder,
      "Module resources & downloads",
      null,
      "resource",
      null,
      null,
      RESOURCE_CONTENT,
      2,
    ]);
  }

  return { lessons, assignments };
}

export { SUBMIT_LINE };
