import { SignUp } from "@clerk/nextjs";

import { AuthCompleteRedirect } from "@/components/auth-complete-redirect";
import { AUTH_ROUTES, CLERK_REDIRECT_PROPS } from "@/lib/clerk/routes";

export default function SignUpPage() {
  return (
    <>
      <AuthCompleteRedirect />
      <div className="flex flex-1 items-center justify-center bg-brand-warm/40 px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Join us</p>
            <h1 className="mt-3 font-heading text-3xl font-light">Create your account</h1>
          </div>
          <SignUp
            routing="path"
            path={AUTH_ROUTES.signUp}
            signInUrl={AUTH_ROUTES.signIn}
            {...CLERK_REDIRECT_PROPS}
          />
        </div>
      </div>
    </>
  );
}
