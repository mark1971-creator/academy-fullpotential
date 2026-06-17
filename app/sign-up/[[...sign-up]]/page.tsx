import { SignUp } from "@clerk/nextjs";

import { AuthCompleteRedirect } from "@/components/auth-complete-redirect";
import {
  AUTH_ROUTES,
  CLERK_REDIRECT_PROPS,
  getClerkRedirectProps,
  sanitizeRedirectPath,
} from "@/lib/clerk/routes";

type SignUpPageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect_url } = await searchParams;
  const destination = sanitizeRedirectPath(redirect_url);
  const redirectProps = redirect_url ? getClerkRedirectProps(destination) : CLERK_REDIRECT_PROPS;

  const signInHref = redirect_url
    ? `${AUTH_ROUTES.signIn}?redirect_url=${encodeURIComponent(destination)}`
    : AUTH_ROUTES.signIn;

  return (
    <>
      <AuthCompleteRedirect destination={destination} />
      <div className="flex flex-1 items-center justify-center bg-brand-warm/40 px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Join us</p>
            <h1 className="mt-3 font-heading text-3xl font-light">Create your account</h1>
          </div>
          <SignUp
            routing="path"
            path={AUTH_ROUTES.signUp}
            signInUrl={signInHref}
            {...redirectProps}
          />
        </div>
      </div>
    </>
  );
}
