import { clerkAuthMiddleware } from "@/lib/clerk/auth-middleware";

/**
 * Clerk authentication middleware (Next.js + Clerk standard entry point).
 * Protects /my-courses and /dashboard for signed-in users.
 */
export default clerkAuthMiddleware;

/** Named export for tooling that expects `middleware`. */
export const middleware = clerkAuthMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
