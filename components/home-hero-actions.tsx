import { Show } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AUTH_ROUTES, DASHBOARD_URL } from "@/lib/clerk/routes";
import { Button } from "@/components/ui/button";

export async function HomeHeroActions() {
  return (
    <div className="mt-12 flex flex-col gap-4 sm:flex-row">
      <Button size="lg" variant="gold" nativeButton={false} render={<Link href="/courses" />}>
        Explore programs
        <ArrowRight className="size-4" />
      </Button>

      <Show when="signed-in">
        <Button
          size="lg"
          variant="hero-outline"
          nativeButton={false}
          render={<Link href={DASHBOARD_URL} />}
        >
          Go to Dashboard
        </Button>
      </Show>

      <Show when="signed-out">
        <Button
          size="lg"
          variant="hero-outline"
          nativeButton={false}
          render={<Link href={AUTH_ROUTES.signUp} />}
        >
          Get started
        </Button>
      </Show>
    </div>
  );
}
