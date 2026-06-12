"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { mapProfile } from "@/lib/supabase/mappers";
import { hasSupabaseAdminConfig } from "@/lib/env";
import type { Profile } from "@/types/lms";

/**
 * Upserts the signed-in Clerk user into Supabase profiles.
 * Never throws — failures are logged and return null so dashboard stays usable.
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

    if (error) {
      console.error("syncCurrentUserProfile:", error.message);
      return null;
    }

    return mapProfile(data);
  } catch (error) {
    console.error("syncCurrentUserProfile:", error);
    return null;
  }
}
