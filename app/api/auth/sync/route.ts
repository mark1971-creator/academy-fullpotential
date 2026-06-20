import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { syncCurrentUserProfile } from "@/lib/actions/users";
import { hasSupabaseAdminConfig } from "@/lib/env";

export const runtime = "nodejs";

/**
 * Claims legacy enrollments and upserts the Clerk user into Supabase profiles.
 * Called immediately after sign-in / sign-up so access works before /my-courses loads.
 */
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasSupabaseAdminConfig()) {
    console.error(
      "[api/auth/sync] SUPABASE_SERVICE_ROLE_KEY is missing — legacy enrollments cannot be claimed.",
    );
    return NextResponse.json(
      { error: "Server enrollment sync is not configured" },
      { status: 503 },
    );
  }

  const profile = await syncCurrentUserProfile();

  return NextResponse.json({
    ok: true,
    profileId: profile?.id ?? userId,
  });
}
