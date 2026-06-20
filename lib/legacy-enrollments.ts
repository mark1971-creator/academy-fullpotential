import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

export const LEGACY_PROFILE_PREFIX = "legacy:";

/** Stable profile id for paid users who have not signed up on the new site yet. */
export function legacyProfileId(email: string): string {
  return `${LEGACY_PROFILE_PREFIX}${normalizeEmail(email)}`;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isLegacyProfileId(id: string): boolean {
  return id.startsWith(LEGACY_PROFILE_PREFIX);
}

export function parseFullName(fullName: string): {
  first_name: string;
  last_name: string | null;
} {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { first_name: trimmed, last_name: null };
  }
  return {
    first_name: trimmed.slice(0, space),
    last_name: trimmed.slice(space + 1),
  };
}

type AdminClient = SupabaseClient<Database>;

const PROGRESS_TABLES = [
  "lesson_progress",
  "assignment_progress",
  "quiz_progress",
] as const;

/**
 * Moves enrollments and progress from one profile to another.
 * Used for legacy claim and duplicate Clerk account reconciliation.
 */
async function migrateUserData(
  supabase: AdminClient,
  fromUserId: string,
  toUserId: string,
): Promise<void> {
  if (fromUserId === toUserId) return;

  const { data: sourceEnrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("id, course_id")
    .eq("user_id", fromUserId);

  if (enrollmentsError) {
    console.error("migrateUserData enrollments lookup:", enrollmentsError.message);
    return;
  }

  for (const enrollment of sourceEnrollments ?? []) {
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", toUserId)
      .eq("course_id", enrollment.course_id)
      .maybeSingle();

    if (existingEnrollment) {
      await supabase.from("enrollments").delete().eq("id", enrollment.id);
      continue;
    }

    const { error } = await supabase
      .from("enrollments")
      .update({ user_id: toUserId })
      .eq("id", enrollment.id);

    if (error) {
      console.error("migrateUserData enrollments:", error.message);
    }
  }

  for (const table of PROGRESS_TABLES) {
    const { error } = await supabase
      .from(table)
      .update({ user_id: toUserId })
      .eq("user_id", fromUserId);

    if (error) {
      console.error(`migrateUserData ${table}:`, error.message);
    }
  }
}

async function deleteLegacyProfileIfEmpty(
  supabase: AdminClient,
  profileId: string,
): Promise<void> {
  if (!isLegacyProfileId(profileId)) return;

  const { count, error: countError } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profileId);

  if (countError) {
    console.error("deleteLegacyProfileIfEmpty count:", countError.message);
    return;
  }

  if (count && count > 0) return;

  const { error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (deleteError) {
    console.error("deleteLegacyProfileIfEmpty delete:", deleteError.message);
  }
}

/**
 * Moves enrollments from legacy placeholder and other profiles sharing the same
 * email to the signed-in Clerk user (handles re-sign-up / duplicate accounts).
 */
export async function claimLegacyEnrollmentsForUser(
  supabase: AdminClient,
  userId: string,
  emails: string | string[] | null | undefined,
): Promise<void> {
  const normalizedEmails = [
    ...new Set(
      (Array.isArray(emails) ? emails : emails ? [emails] : [])
        .map((email) => normalizeEmail(email))
        .filter(Boolean),
    ),
  ];

  for (const email of normalizedEmails) {
    await claimEnrollmentsForEmail(supabase, userId, email);
  }
}

async function claimEnrollmentsForEmail(
  supabase: AdminClient,
  userId: string,
  email: string,
): Promise<void> {
  const legacyId = legacyProfileId(email);
  const sourceProfileIds = new Set<string>();

  const { data: legacyProfile, error: legacyLookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", legacyId)
    .maybeSingle();

  if (legacyLookupError) {
    console.error("claimEnrollmentsForEmail legacy lookup:", legacyLookupError.message);
  } else if (legacyProfile) {
    sourceProfileIds.add(legacyId);
  }

  const { data: emailProfiles, error: emailLookupError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", email);

  if (emailLookupError) {
    console.error("claimEnrollmentsForEmail email lookup:", emailLookupError.message);
  } else {
    for (const profile of emailProfiles ?? []) {
      if (profile.id !== userId) {
        sourceProfileIds.add(profile.id);
      }
    }
  }

  for (const sourceProfileId of sourceProfileIds) {
    await migrateUserData(supabase, sourceProfileId, userId);
    await deleteLegacyProfileIfEmpty(supabase, sourceProfileId);
  }
}
