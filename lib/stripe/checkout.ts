import "server-only";

import type { Course } from "@/types/lms";

import { getAppBaseUrl } from "@/lib/env";
import { getStripe } from "@/lib/stripe/server";

type CreateCheckoutSessionInput = {
  course: Pick<Course, "id" | "slug" | "title" | "description" | "tagline" | "price">;
  userId: string;
  customerEmail: string | null;
};

export async function createStripeCheckoutSession({
  course,
  userId,
  customerEmail,
}: CreateCheckoutSessionInput) {
  const stripe = getStripe();
  const baseUrl = getAppBaseUrl();
  const unitAmount = Math.round(course.price * 100);

  if (unitAmount <= 0) {
    throw new Error("Checkout requires a positive price.");
  }

  const description =
    course.tagline ??
    (course.description ? course.description.slice(0, 500) : undefined);

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customerEmail ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: course.title,
            description,
          },
        },
      },
    ],
    metadata: {
      userId,
      courseId: course.id,
      courseSlug: course.slug,
    },
    success_url: `${baseUrl}/courses/${course.slug}/enroll/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/courses/${course.slug}?payment=cancelled`,
  });
}
