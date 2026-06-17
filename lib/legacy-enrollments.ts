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

/**
 * Moves enrollments (and any progress rows) from legacy placeholder profile(s)
 * to the signed-in Clerk user when an email address matches.
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
    await claimLegacyEnrollmentsForEmail(supabase, userId, email);
  }
}

async function claimLegacyEnrollmentsForEmail(
  supabase: AdminClient,
  userId: string,
  email: string,
): Promise<void> {
  const legacyId = legacyProfileId(email);
  if (legacyId === userId) return;

  const { data: legacyProfile, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", legacyId)
    .maybeSingle();

  if (lookupError) {
    console.error("claimLegacyEnrollmentsForUser lookup:", lookupError.message);
    return;
  }

  if (!legacyProfile) return;

  const { data: legacyEnrollments, error: legacyEnrollmentsError } = await supabase
    .from("enrollments")
    .select("id, course_id")
    .eq("user_id", legacyId);

  if (legacyEnrollmentsError) {
    console.error(
      "claimLegacyEnrollmentsForUser enrollments lookup:",
      legacyEnrollmentsError.message,
    );
    return;
  }

  for (const enrollment of legacyEnrollments ?? []) {
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", enrollment.course_id)
      .maybeSingle();

    if (existingEnrollment) {
      await supabase.from("enrollments").delete().eq("id", enrollment.id);
      continue;
    }

    const { error } = await supabase
      .from("enrollments")
      .update({ user_id: userId })
      .eq("id", enrollment.id);

    if (error) {
      console.error("claimLegacyEnrollmentsForUser enrollments:", error.message);
    }
  }

  const progressTables = [
    "lesson_progress",
    "assignment_progress",
    "quiz_progress",
  ] as const;

  for (const table of progressTables) {
    const { error } = await supabase
      .from(table)
      .update({ user_id: userId })
      .eq("user_id", legacyId);

    if (error) {
      console.error(`claimLegacyEnrollmentsForUser ${table}:`, error.message);
    }
  }

  const { error: deleteError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", legacyId);

  if (deleteError) {
    console.error("claimLegacyEnrollmentsForUser delete:", deleteError.message);
  }
}
