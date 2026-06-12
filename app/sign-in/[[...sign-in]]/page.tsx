import { SignIn } from "@clerk/nextjs";

import { AuthCompleteRedirect } from "@/components/auth-complete-redirect";
import { AUTH_ROUTES, CLERK_REDIRECT_PROPS } from "@/lib/clerk/routes";

export default function SignInPage() {
  return (
    <>
      <AuthCompleteRedirect />
      <div className="flex flex-1 items-center justify-center bg-brand-warm/40 px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Welcome back</p>
            <h1 className="mt-3 font-heading text-3xl font-light">Sign in to the Academy</h1>
          </div>
          <SignIn
            routing="path"
            path={AUTH_ROUTES.signIn}
            signUpUrl={AUTH_ROUTES.signUp}
            {...CLERK_REDIRECT_PROPS}
          />
        </div>
      </div>
    </>
  );
}
