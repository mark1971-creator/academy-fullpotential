import "server-only";

import { grantCourseEnrollment } from "@/lib/actions/enrollments";
import { getStripe } from "@/lib/stripe/server";

/**
 * Confirms a completed Checkout Session and grants enrollment.
 * Used on the success redirect (webhook may arrive slightly later).
 */
export async function fulfillCheckoutSession(
  sessionId: string,
  expectedUserId: string,
): Promise<{ success: boolean; error?: string }> {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { success: false, error: "Payment not completed." };
  }

  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;

  if (!userId || !courseId || userId !== expectedUserId) {
    return { success: false, error: "Invalid checkout session." };
  }

  return grantCourseEnrollment(userId, courseId, {
    email: session.customer_details?.email ?? session.customer_email ?? null,
  });
}
