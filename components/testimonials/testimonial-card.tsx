"use client";

import { Quote, Star, X } from "lucide-react";
import { useRef } from "react";

import {
  getTestimonialInitials,
  testimonialNeedsExpand,
} from "@/components/testimonials/testimonial-utils";
import { BrandCard } from "@/components/ui/brand-elements";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/lms";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

function TestimonialStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={
            index < Math.round(rating)
              ? "size-3.5 fill-brand-gold text-brand-gold"
              : "size-3.5 text-border"
          }
        />
      ))}
    </div>
  );
}

function TestimonialAuthor({ testimonial }: { testimonial: Testimonial }) {
  return (
    <footer className="flex items-center gap-4 border-t border-border/80 pt-4">
      <div
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/18 text-sm font-semibold tracking-wide text-brand-gold-light"
      >
        {getTestimonialInitials(testimonial)}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-foreground">{testimonial.name}</p>
        {testimonial.role && (
          <p className="mt-0.5 text-sm text-brand-warm">{testimonial.role}</p>
        )}
        {testimonial.date && (
          <p className="mt-0.5 text-xs text-brand-warm/80">{testimonial.date}</p>
        )}
      </div>
    </footer>
  );
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const showSeeMore = testimonialNeedsExpand(testimonial);

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  return (
    <>
      <BrandCard
        data-testimonial-card
        className={cn(
          "relative flex h-[19.5rem] flex-col border-brand-gold/25 p-6 sm:p-7",
          className,
        )}
      >
        <Quote className="size-6 text-brand-gold/45" strokeWidth={1.25} />

        {testimonial.rating != null && (
          <div className="mt-3">
            <TestimonialStars rating={testimonial.rating} />
          </div>
        )}

        <blockquote className="mt-4 line-clamp-4 text-[0.925rem] leading-[1.7] text-brand-warm-soft">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {showSeeMore && (
          <button
            type="button"
            onClick={openDialog}
            className="mt-3 self-start text-sm font-medium text-brand-gold-light underline-offset-4 transition-colors hover:text-brand-gold hover:underline"
          >
            See more
          </button>
        )}

        <div className="mt-auto pt-4">
          <TestimonialAuthor testimonial={testimonial} />
        </div>
      </BrandCard>

      <dialog
        ref={dialogRef}
        className="academy-testimonial-dialog fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-4 backdrop:bg-brand-charcoal/75 sm:p-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="flex min-h-full items-center justify-center">
          <BrandCard className="relative max-h-[min(85vh,40rem)] w-full max-w-2xl overflow-y-auto border-brand-gold/30 p-7 sm:p-9">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close review"
              onClick={closeDialog}
              className="absolute top-4 right-4 text-brand-warm hover:bg-white/8 hover:text-foreground"
            >
              <X className="size-4" />
            </Button>

            <Quote className="size-8 text-brand-gold/50" strokeWidth={1.25} />

            {testimonial.rating != null && (
              <div className="mt-4">
                <TestimonialStars rating={testimonial.rating} />
              </div>
            )}

            <blockquote className="mt-6 whitespace-pre-line text-base leading-[1.8] text-brand-warm-soft">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            <div className="mt-8">
              <TestimonialAuthor testimonial={testimonial} />
            </div>
          </BrandCard>
        </div>
      </dialog>
    </>
  );
}
