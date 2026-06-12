"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { DASHBOARD_URL } from "@/lib/clerk/routes";

/**
 * After sign-in/up, wait for Clerk session then navigate to dashboard.
 * Uses refresh + replace to sync the server session cookie before loading /dashboard.
 */
export function AuthCompleteRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasRedirected.current) {
      return;
    }

    hasRedirected.current = true;

    const navigate = async () => {
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 150));
      router.replace(DASHBOARD_URL);
    };

    void navigate();
  }, [isLoaded, isSignedIn, router]);

  return null;
}
