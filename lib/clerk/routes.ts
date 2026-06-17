/** Public academy home / landing page. */
export const HOME_URL = "/";

/** Post-authentication destination for the academy. */
export const MY_LEARNING_URL = "/my-courses";

/** @deprecated Use MY_LEARNING_URL */
export const DASHBOARD_URL = MY_LEARNING_URL;

export const AUTH_ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

/** Validates an internal post-auth path (prevents open redirects). */
export function sanitizeRedirectPath(path: string | undefined | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return MY_LEARNING_URL;
  }
  return path;
}

/** Clerk redirect props for a specific post-auth destination. */
export function getClerkRedirectProps(destination: string) {
  const url = sanitizeRedirectPath(destination);
  return {
    forceRedirectUrl: url,
    fallbackRedirectUrl: url,
    signInForceRedirectUrl: url,
    signInFallbackRedirectUrl: url,
    signUpForceRedirectUrl: url,
    signUpFallbackRedirectUrl: url,
  } as const;
}

/** Default Clerk redirect configuration (Clerk v7 force/fallback URLs). */
export const CLERK_REDIRECT_PROPS = getClerkRedirectProps(MY_LEARNING_URL);

export const CLERK_PROVIDER_PROPS = {
  signInUrl: AUTH_ROUTES.signIn,
  signUpUrl: AUTH_ROUTES.signUp,
  ...CLERK_REDIRECT_PROPS,
} as const;
