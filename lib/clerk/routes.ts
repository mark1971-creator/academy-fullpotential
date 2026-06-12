/** Post-authentication destination for the academy. */
export const DASHBOARD_URL = "/dashboard";

export const AUTH_ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

/** Shared Clerk redirect configuration (Clerk v7 force/fallback URLs). */
export const CLERK_REDIRECT_PROPS = {
  forceRedirectUrl: DASHBOARD_URL,
  fallbackRedirectUrl: DASHBOARD_URL,
  signInForceRedirectUrl: DASHBOARD_URL,
  signInFallbackRedirectUrl: DASHBOARD_URL,
  signUpForceRedirectUrl: DASHBOARD_URL,
  signUpFallbackRedirectUrl: DASHBOARD_URL,
} as const;

export const CLERK_PROVIDER_PROPS = {
  signInUrl: AUTH_ROUTES.signIn,
  signUpUrl: AUTH_ROUTES.signUp,
  ...CLERK_REDIRECT_PROPS,
} as const;
