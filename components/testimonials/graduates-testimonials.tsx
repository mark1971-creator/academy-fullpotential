import { TestimonialsCarousel } from "@/components/testimonials/testimonials-carousel";
import { HPCC_TESTIMONIALS } from "@/lib/courses/hpcc-testimonials";
import type { Testimonial } from "@/types/lms";

type GraduatesTestimonialsProps = {
  testimonials?: Testimonial[];
  className?: string;
  titleClassName?: string;
  variant?: "light" | "dark";
};

export function GraduatesTestimonials({
  testimonials = HPCC_TESTIMONIALS,
  className = "mt-28 border-t border-white/8 pt-28",
  titleClassName,
  variant = "dark",
}: GraduatesTestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <TestimonialsCarousel
      title="What Our Graduates Say"
      testimonials={testimonials}
      className={className}
      titleClassName={titleClassName}
      variant={variant}
    />
  );
}
