import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { AUTH_ROUTES } from "@/lib/clerk/routes";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/my-courses(.*)"]);

/**
 * Next.js 16 auth middleware (file must be named proxy.ts).
 * Protects /my-courses and /dashboard for authenticated users.
 */
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const signInUrl = new URL(AUTH_ROUTES.signIn, req.url);
    await auth.protect({
      unauthenticatedUrl: signInUrl.toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
