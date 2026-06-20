import { SignIn } from "@clerk/nextjs";

import { AuthCompleteRedirect } from "@/components/auth-complete-redirect";
import {
  AUTH_ROUTES,
  CLERK_REDIRECT_PROPS,
  getClerkRedirectProps,
  sanitizeRedirectPath,
} from "@/lib/clerk/routes";

type SignInPageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect_url } = await searchParams;
  const destination = sanitizeRedirectPath(redirect_url);
  const redirectProps = redirect_url ? getClerkRedirectProps(destination) : CLERK_REDIRECT_PROPS;

  const signUpHref = redirect_url
    ? `${AUTH_ROUTES.signUp}?redirect_url=${encodeURIComponent(destination)}`
    : AUTH_ROUTES.signUp;

  return (
    <>
      <AuthCompleteRedirect destination={destination} />
      <div className="flex flex-1 items-center justify-center bg-brand-warm/40 px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Welcome back</p>
            <h1 className="mt-3 font-heading text-3xl font-light">Sign in to the Academy</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Returning HPCC student from the previous academy site? If you have not created an
              account here yet, use{" "}
              <a href={signUpHref} className="font-medium text-brand-blue underline-offset-4 hover:underline">
                Sign up
              </a>{" "}
              with the same email you used when you enrolled.
            </p>
          </div>
          <SignIn
            routing="path"
            path={AUTH_ROUTES.signIn}
            signUpUrl={signUpHref}
            {...redirectProps}
          />
        </div>
      </div>
    </>
  );
}
