import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { AUTH_ROUTES } from "@/lib/clerk/routes";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/my-courses(.*)"]);

/** Shared Clerk middleware — used by root `middleware.ts`. */
export const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const signInUrl = new URL(AUTH_ROUTES.signIn, req.url);
    await auth.protect({
      unauthenticatedUrl: signInUrl.toString(),
    });
  }
});
