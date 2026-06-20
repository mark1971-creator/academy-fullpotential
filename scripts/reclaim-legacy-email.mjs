#!/usr/bin/env node
// Re-run legacy claim for an email (e.g. after duplicate Clerk account sign-up).
// Usage: node scripts/reclaim-legacy-email.mjs markandfeiyin@gmail.com [clerkUserId]

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import {
  claimLegacyEnrollmentsForUser,
  normalizeEmail,
} from "../lib/legacy-enrollments.ts";

const email = normalizeEmail(process.argv[2] ?? "");
const targetUserId = process.argv[3]?.trim();

if (!email) {
  console.error("Usage: node scripts/reclaim-legacy-email.mjs <email> [clerkUserId]");
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

let userId = targetUserId;
if (!userId) {
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, created_at")
    .ilike("email", email)
    .order("created_at", { ascending: false });

  if (!profiles?.length) {
    console.error(`No Supabase profile found for ${email}`);
    process.exit(1);
  }

  userId = profiles[0].id;
}

await claimLegacyEnrollmentsForUser(sb, userId, email);

const { data: course } = await sb
  .from("courses")
  .select("id")
  .eq("slug", "human-potential-coach-certification")
  .single();

const { data: enrollment } = await sb
  .from("enrollments")
  .select("*")
  .eq("user_id", userId)
  .eq("course_id", course.id)
  .maybeSingle();

console.log(
  JSON.stringify(
    {
      email,
      targetUserId: userId,
      hpccEnrolled: Boolean(enrollment),
      enrollment,
    },
    null,
    2,
  ),
);
