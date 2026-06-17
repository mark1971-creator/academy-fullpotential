"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/lms";

type TestimonialsCarouselProps = {
  testimonials: Testimonial[];
  title: string;
  className?: string;
  titleClassName?: string;
  variant?: "light" | "dark";
};

const navButtonClassNames = {
  dark: "border-white/15 bg-white/5 text-foreground hover:border-brand-gold/50 hover:bg-brand-gold/12 hover:text-brand-gold-light disabled:opacity-35",
  light:
    "border-slate-200 bg-white text-brand-navy hover:border-brand-gold/50 hover:bg-brand-gold/10 hover:text-brand-navy disabled:opacity-35",
} as const;

export function TestimonialsCarousel({
  testimonials,
  title,
  className,
  titleClassName,
  variant = "dark",
}: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft < maxScrollLeft - 8);
  }, []);

  const scrollByPage = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-testimonial-card]");
    const gap = 24;
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.85;

    track.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [testimonials.length, updateScrollState]);

  if (testimonials.length === 0) return null;

  return (
    <section className={className}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div aria-hidden className="mb-5 h-px w-12 academy-gold-line opacity-80" />
          <h2
            className={cn(
              "font-heading text-3xl font-light tracking-tight text-foreground sm:text-4xl",
              titleClassName,
            )}
          >
            {title}
          </h2>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous testimonials"
              disabled={!canScrollLeft}
              onClick={() => scrollByPage("left")}
              className={navButtonClassNames[variant]}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next testimonials"
              disabled={!canScrollRight}
              onClick={() => scrollByPage("right")}
              className={navButtonClassNames[variant]}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="academy-scrollbar-hide mt-10 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {testimonials.map((testimonial) => (
          <div
            key={`${testimonial.name}-${testimonial.quote.slice(0, 32)}`}
            className="w-[min(100%,20rem)] shrink-0 snap-start self-stretch sm:w-[min(calc(50%-0.75rem),22rem)] lg:w-[min(calc(33.333%-1rem),24rem)] xl:w-[min(calc(25%-1rem),22rem)]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
    </section>
  );
}
