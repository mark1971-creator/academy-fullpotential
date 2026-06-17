import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthActionsProps = {
  variant?: "chrome" | "dark";
};

function SignedOutActions({ variant = "chrome" }: AuthActionsProps) {
  const isChrome = variant === "chrome";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "uppercase tracking-[0.14em]",
          isChrome
            ? "text-brand-chrome-muted hover:bg-slate-100 hover:text-brand-chrome-foreground"
            : "text-brand-warm hover:bg-white/5 hover:text-foreground",
        )}
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

export async function AuthActions({ variant = "chrome" }: AuthActionsProps) {
  let userId: string | null = null;

  try {
    ({ userId } = await auth());
  } catch (error) {
    unstable_rethrow(error);
    console.error("AuthActions: failed to resolve Clerk session", error);
    userId = null;
  }

  if (!userId) {
    return <SignedOutActions variant={variant} />;
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-9 ring-1 ring-brand-blue/25",
        },
      }}
    />
  );
}
