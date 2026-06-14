"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { mapProfile } from "@/lib/supabase/mappers";
import { resolveSafeDefault } from "@/lib/supabase/errors";
import { hasSupabaseAdminConfig } from "@/lib/env";
import type { Profile } from "@/types/lms";

/**
 * Upserts the signed-in Clerk user into Supabase profiles.
 * Never throws (besides Next.js control-flow) — failures degrade to null so the
 * dashboard stays usable. Connectivity issues log a single concise warning.
 */
export async function syncCurrentUserProfile(): Promise<Profile | null> {
  try {
    const { userId } = await auth();
    if (!userId || !hasSupabaseAdminConfig()) {
      return null;
    }

    const user = await currentUser();
    if (!user) {
      return null;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          first_name: user.firstName,
          last_name: user.lastName,
          avatar_url: user.imageUrl,
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    if (error) throw error;

    return mapProfile(data);
  } catch (error) {
    return resolveSafeDefault("syncCurrentUserProfile", error, null);
  }
}
