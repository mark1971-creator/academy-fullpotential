import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { grantCourseEnrollment } from "@/lib/actions/enrollments";
import { getStripeWebhookSecret, hasStripeWebhookConfig } from "@/lib/env";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasStripeWebhookConfig()) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    console.error("Stripe webhook verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, skipped: "unpaid" });
    }

    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (!userId || !courseId) {
      console.error("Stripe webhook missing metadata", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const result = await grantCourseEnrollment(userId, courseId, {
      email: session.customer_details?.email ?? session.customer_email ?? null,
    });

    if (!result.success) {
      console.error("Stripe webhook enrollment failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
