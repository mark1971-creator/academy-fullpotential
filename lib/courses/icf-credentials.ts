/** Courses that award ICF Core Competency Continuing Education Units (CCEUs). */
export const ICF_CCEU_BY_SLUG: Record<string, number> = {
  "human-potential-coach-certification": 25,
  "idg-coach-certification": 25,
};

export function getCourseIcfCceus(slug: string): number | null {
  return ICF_CCEU_BY_SLUG[slug] ?? null;
}

export function formatIcfCceuLabel(cceus: number): string {
  return `${cceus} ICF CCEUs`;
}
