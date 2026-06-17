import "server-only";

import Stripe from "stripe";

import { getStripeSecretKey, hasStripeConfig } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!hasStripeConfig()) {
    throw new Error("Stripe is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey());
  }

  return stripeClient;
}
