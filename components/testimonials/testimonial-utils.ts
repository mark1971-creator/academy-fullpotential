import type { Testimonial } from "@/types/lms";

export function getTestimonialInitials(testimonial: Testimonial): string {
  if (testimonial.initials) return testimonial.initials;
  return testimonial.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function testimonialNeedsExpand(testimonial: Testimonial): boolean {
  return testimonial.quote.length > 160 || testimonial.quote.includes("\n");
}
