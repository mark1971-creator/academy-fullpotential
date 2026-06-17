"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { MY_LEARNING_URL, sanitizeRedirectPath } from "@/lib/clerk/routes";

type AuthCompleteRedirectProps = {
  destination?: string;
};

/**
 * After sign-in/up, wait for Clerk session then navigate to the intended destination.
 */
export function AuthCompleteRedirect({
  destination = MY_LEARNING_URL,
}: AuthCompleteRedirectProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const target = sanitizeRedirectPath(destination);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasRedirected.current) {
      return;
    }

    hasRedirected.current = true;

    const navigate = async () => {
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 150));
      router.replace(target);
    };

    void navigate();
  }, [isLoaded, isSignedIn, router, target]);

  return null;
}
