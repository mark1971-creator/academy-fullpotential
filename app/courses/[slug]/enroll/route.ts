import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCourseBySlug } from "@/lib/actions/courses";
import { enrollInCourse, isUserEnrolledInCourse } from "@/lib/actions/enrollments";
import { hasStripeConfig } from "@/lib/env";
import { createStripeCheckoutSession } from "@/lib/stripe/checkout";

type RouteContext = { params: Promise<{ slug: string }> };

/**
 * Unified enroll entry: sign-in (if needed) → free enroll OR Stripe Checkout → learn.
 * Implemented as a Route Handler so revalidatePath can run before redirect (Next.js 16
 * disallows revalidation during Server Component render).
 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const enrollPath = `/courses/${slug}/enroll`;

  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-up?redirect_url=${encodeURIComponent(enrollPath)}`);
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    redirect("/courses");
  }

  if (await isUserEnrolledInCourse(course.id)) {
    redirect(`/my-courses/${slug}`);
  }

  if (course.price === 0) {
    const result = await enrollInCourse(course.id);
    if (!result.success) {
      redirect(
        `/courses/${slug}?enroll_error=${encodeURIComponent(result.error ?? "enroll_failed")}`,
      );
    }
    redirect(`/my-courses/${slug}`);
  }

  if (!hasStripeConfig()) {
    redirect(`/courses/${slug}?enroll_error=payment_unavailable`);
  }

  const user = await currentUser();
  const session = await createStripeCheckoutSession({
    course,
    userId,
    customerEmail: user?.primaryEmailAddress?.emailAddress ?? null,
  });

  if (!session.url) {
    redirect(`/courses/${slug}?enroll_error=checkout_failed`);
  }

  redirect(session.url);
}
