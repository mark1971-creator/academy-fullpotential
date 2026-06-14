import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import { Button } from "@/components/ui/button";

function SignedOutActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="uppercase tracking-[0.14em] text-foreground/70"
        nativeButton={false}
        render={<Link href="/sign-in" />}
      >
        Login
      </Button>
      <Button
        size="sm"
        variant="gold"
        nativeButton={false}
        render={<Link href="/sign-up" />}
      >
        Sign up
      </Button>
    </div>
  );
}

export async function AuthActions() {
  // Resolve the session on the server. If Clerk can't be reached (e.g. transient
  // network/middleware error), fall back to the signed-out actions rather than
  // throwing and tripping the route's error boundary.
  let userId: string | null = null;

  try {
    ({ userId } = await auth());
  } catch (error) {
    // Let Next.js internal control-flow signals (dynamic rendering, redirect,
    // notFound) propagate; only swallow genuine Clerk/session failures.
    unstable_rethrow(error);
    console.error("AuthActions: failed to resolve Clerk session", error);
    userId = null;
  }

  if (!userId) {
    return <SignedOutActions />;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-9 ring-1 ring-brand-gold/30",
        },
      }}
    />
  );
}
