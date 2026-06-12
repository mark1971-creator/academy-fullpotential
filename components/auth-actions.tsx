import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export async function AuthActions() {
  return (
    <>
      <Show when="signed-out">
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
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9 ring-1 ring-brand-gold/30",
            },
          }}
        />
      </Show>
    </>
  );
}
