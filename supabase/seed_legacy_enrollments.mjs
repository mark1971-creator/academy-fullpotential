// Grants legacy / complimentary enrollments (HPCC, Employee Experience, etc.).
// Idempotent — safe to re-run.
//
// Run from the project root:   npm run seed:legacy-enrollments
//
// Users without a Clerk account get a placeholder profile (legacy:<email>).
// When they sign up, syncCurrentUserProfile() migrates enrollments to their Clerk id.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { LEGACY_ENROLLMENT_BATCHES } from "./seed-data/legacy-enrollment-batches.mjs";

const LEGACY_PROFILE_PREFIX = "legacy:";

function loadEnv() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  for (const name of [".env.local", ".env"]) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    const raw = readFileSync(path, "utf8");
    const env = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m) env[m[1]] = m[2];
    }
    return env;
  }
  throw new Error("Missing .env.local or .env");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function legacyProfileId(email) {
  return `${LEGACY_PROFILE_PREFIX}${normalizeEmail(email)}`;
}

function parseFullName(fullName) {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const space = trimmed.indexOf(" ");
  if (space === -1) return { first_name: trimmed, last_name: null };
  return {
    first_name: trimmed.slice(0, space),
    last_name: trimmed.slice(space + 1),
  };
}

async function findClerkUserIdByEmail(email, secretKey) {
  if (!secretKey) return null;

  const url = new URL("https://api.clerk.com/v1/users");
  url.searchParams.append("email_address", normalizeEmail(email));

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  if (!response.ok) {
    console.warn(`Clerk lookup failed for ${email}: ${response.status}`);
    return null;
  }

  const users = await response.json();
  return users?.[0]?.id ?? null;
}

async function seedBatch(db, batch, clerkSecret) {
  const { data: course, error: courseError } = await db
    .from("courses")
    .select("id, slug, title")
    .eq("slug", batch.courseSlug)
    .maybeSingle();

  if (courseError || !course) {
    throw new Error(`Course not found: ${batch.courseSlug}`);
  }

  const seenEmails = new Set();
  const summary = {
    profilesCreated: 0,
    profilesUpdated: 0,
    enrollmentsCreated: 0,
    enrollmentsExisting: 0,
    clerkMatched: 0,
    legacyPlaceholder: 0,
    skippedDuplicate: 0,
  };

  for (const enrollee of batch.enrollees) {
    const email = normalizeEmail(enrollee.email);
    if (seenEmails.has(email)) {
      summary.skippedDuplicate += 1;
      console.warn(`Skipping duplicate email in source data: ${email}`);
      continue;
    }
    seenEmails.add(email);

    const clerkUserId = await findClerkUserIdByEmail(email, clerkSecret);
    const profileId = legacyProfileId(email);
    const { first_name, last_name } = parseFullName(enrollee.full_name);

    if (clerkUserId) {
      summary.clerkMatched += 1;
    } else {
      summary.legacyPlaceholder += 1;
    }

    const { data: existingProfile } = await db
      .from("profiles")
      .select("id, email, first_name, last_name")
      .eq("id", profileId)
      .maybeSingle();

    const { error: profileError } = await db.from("profiles").upsert(
      {
        id: profileId,
        email,
        first_name,
        last_name,
      },
      { onConflict: "id" },
    );

    if (profileError) throw profileError;

    if (existingProfile) {
      summary.profilesUpdated += 1;
    } else {
      summary.profilesCreated += 1;
    }

    const { data: existingEnrollment } = await db
      .from("enrollments")
      .select("id")
      .eq("user_id", profileId)
      .eq("course_id", course.id)
      .maybeSingle();

    if (existingEnrollment) {
      summary.enrollmentsExisting += 1;
      continue;
    }

    const { error: enrollmentError } = await db.from("enrollments").insert({
      user_id: profileId,
      course_id: course.id,
      progress_percent: 0,
      enrolled_at: batch.enrolledAt,
    });

    if (enrollmentError) throw enrollmentError;
    summary.enrollmentsCreated += 1;
  }

  console.log(`\nLegacy enrollments for: ${course.title}`);
  console.log(`  Unique emails processed: ${seenEmails.size}`);
  console.log(`  Profiles created:        ${summary.profilesCreated}`);
  console.log(`  Profiles updated:        ${summary.profilesUpdated}`);
  console.log(`  Enrollments created:     ${summary.enrollmentsCreated}`);
  console.log(`  Enrollments existing:    ${summary.enrollmentsExisting}`);
  console.log(`  Matched Clerk accounts:  ${summary.clerkMatched}`);
  console.log(`  Legacy placeholders:     ${summary.legacyPlaceholder}`);
  if (summary.skippedDuplicate > 0) {
    console.log(`  Skipped duplicate rows:  ${summary.skippedDuplicate}`);
  }
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const clerkSecret = env.CLERK_SECRET_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  const db = createClient(url, serviceKey);

  for (const batch of LEGACY_ENROLLMENT_BATCHES) {
    await seedBatch(db, batch, clerkSecret);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
