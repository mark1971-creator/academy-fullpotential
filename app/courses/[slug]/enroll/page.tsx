import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import { getCourseBySlug } from "@/lib/actions/courses";
import { enrollInCourse, isUserEnrolledInCourse } from "@/lib/actions/enrollments";
import { hasStripeConfig } from "@/lib/env";
import { createStripeCheckoutSession } from "@/lib/stripe/checkout";

type CourseEnrollPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Unified enroll entry: sign-in (if needed) → free enroll OR Stripe Checkout → learn.
 * Linked from every "Enroll now" CTA on course preview pages.
 */
export default async function CourseEnrollPage({ params }: CourseEnrollPageProps) {
  const { slug } = await params;
  const enrollPath = `/courses/${slug}/enroll`;

  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-up?redirect_url=${encodeURIComponent(enrollPath)}`);
  }

  const course = await getCourseBySlug(slug);
  if (!course) {
    notFound();
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
