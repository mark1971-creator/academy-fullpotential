#!/usr/bin/env node
// Usage: node scripts/check-legacy-email.mjs markandfeiyin@gmail.com

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const email = (process.argv[2] ?? "").trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/check-legacy-email.mjs <email>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = join(root, file);
    if (!existsSync(path)) continue;
    const env = {};
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m) {
        let value = m[2].trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        env[m[1]] = value;
      }
    }
    return env;
  }
  throw new Error("Missing .env.local or .env");
}

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const legacyId = `legacy:${email}`;

const { data: course } = await sb
  .from("courses")
  .select("id, slug")
  .eq("slug", "human-potential-coach-certification")
  .single();

const { data: legacyProfile } = await sb
  .from("profiles")
  .select("*")
  .eq("id", legacyId)
  .maybeSingle();

const { data: legacyEnrollments } = await sb
  .from("enrollments")
  .select("*")
  .eq("user_id", legacyId);

const { data: emailProfiles } = await sb
  .from("profiles")
  .select("id, email, created_at")
  .ilike("email", email);

const clerkEnrollments = [];
for (const profile of emailProfiles ?? []) {
  const { data } = await sb
    .from("enrollments")
    .select("*")
    .eq("user_id", profile.id)
    .eq("course_id", course.id);
  if (data?.length) {
    clerkEnrollments.push({ profileId: profile.id, enrollments: data });
  }
}

console.log(
  JSON.stringify(
    {
      email,
      legacyId,
      legacyProfileExists: Boolean(legacyProfile),
      legacyProfile,
      legacyEnrollments,
      clerkProfiles: emailProfiles,
      clerkHpccEnrollments: clerkEnrollments,
      diagnosis:
        clerkEnrollments.length > 0
          ? "User already has HPCC enrollment on Clerk profile"
          : legacyProfile && legacyEnrollments?.length
            ? "Legacy enrollment exists but NOT claimed — claim should run on sign-in"
            : !legacyProfile
              ? "No legacy profile in DB — seed may not include this email or seed not run"
              : "Legacy profile exists but no enrollment row",
    },
    null,
    2,
  ),
);
