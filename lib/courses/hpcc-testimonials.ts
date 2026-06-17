import hpccTestimonialsJson from "@/supabase/seed-data/hpcc-testimonials.json";
import type { Testimonial } from "@/types/lms";

function parseTestimonial(item: unknown): Testimonial | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  if (typeof row.name !== "string" || typeof row.quote !== "string") return null;

  return {
    name: row.name,
    role: typeof row.role === "string" ? row.role : null,
    quote: row.quote,
    rating: typeof row.rating === "number" ? row.rating : null,
    initials: typeof row.initials === "string" ? row.initials : null,
    date: typeof row.date === "string" ? row.date : null,
  };
}

/** Canonical HPCC graduate testimonials (also seeded to Supabase). */
export const HPCC_TESTIMONIALS: Testimonial[] = (
  hpccTestimonialsJson as unknown[]
).flatMap((item) => {
  const parsed = parseTestimonial(item);
  return parsed ? [parsed] : [];
});
