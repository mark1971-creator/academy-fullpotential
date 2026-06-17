import { TestimonialsCarousel } from "@/components/testimonials/testimonials-carousel";
import type { Testimonial } from "@/types/lms";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
  title?: string;
};

export function TestimonialsSection({
  testimonials,
  title = "Student Reviews",
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <TestimonialsCarousel
      title={title}
      testimonials={testimonials}
      titleClassName="text-2xl sm:text-3xl"
    />
  );
}
