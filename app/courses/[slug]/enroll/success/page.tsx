import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getCourseBySlug } from "@/lib/actions/courses";
import { hasStripeConfig } from "@/lib/env";
import { fulfillCheckoutSession } from "@/lib/stripe/fulfill";

type EnrollSuccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
};

/**
 * Stripe Checkout success landing. Grants enrollment before redirecting to learn.
 */
export default async function EnrollSuccessPage({
  params,
  searchParams,
}: EnrollSuccessPageProps) {
  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;

  const { userId } = await auth();
  if (!userId) {
    const returnPath = sessionId
      ? `/courses/${slug}/enroll/success?session_id=${encodeURIComponent(sessionId)}`
      : `/courses/${slug}/enroll`;
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnPath)}`);
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
  }

  if (!sessionId || !hasStripeConfig()) {
    redirect(`/courses/${slug}?enroll_error=checkout_failed`);
  }

  const result = await fulfillCheckoutSession(sessionId, userId);
  if (!result.success) {
    redirect(
      `/courses/${slug}?enroll_error=${encodeURIComponent(result.error ?? "enroll_failed")}`,
    );
  }

  redirect(`/my-courses/${slug}?payment=success`);
}
