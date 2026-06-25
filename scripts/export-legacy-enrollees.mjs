#!/usr/bin/env node
// Export HPCC legacy enrollees for outreach (CSV + JSON).
// Usage: node scripts/export-legacy-enrollees.mjs

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { HPCC_LEGACY_ENROLLEES } from "../supabase/seed-data/hpcc-legacy-enrollees.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "exports");

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

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const env = loadEnv();
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const { data: course } = await sb
  .from("courses")
  .select("id, slug, title")
  .eq("slug", "human-potential-coach-certification")
  .single();

const { data: enrollments } = await sb
  .from("enrollments")
  .select("user_id, enrolled_at, progress_percent")
  .eq("course_id", course.id);

const { data: profiles } = await sb.from("profiles").select("id, email, first_name, last_name");

const enrollmentByUserId = new Map((enrollments ?? []).map((e) => [e.user_id, e]));
const profilesByEmail = new Map();
for (const profile of profiles ?? []) {
  if (profile.email) {
    profilesByEmail.set(normalizeEmail(profile.email), profile);
  }
}

const seen = new Set();
const rows = [];

for (const enrollee of HPCC_LEGACY_ENROLLEES) {
  const email = normalizeEmail(enrollee.email);
  if (seen.has(email)) continue;
  seen.add(email);

  const legacyId = `legacy:${email}`;
  const profile = profilesByEmail.get(email);
  const legacyEnrollment = enrollmentByUserId.get(legacyId);
  const clerkEnrollment =
    profile && !profile.id.startsWith("legacy:")
      ? enrollmentByUserId.get(profile.id)
      : undefined;

  let status = "not_in_database";
  if (clerkEnrollment) {
    status = "claimed";
  } else if (legacyEnrollment) {
    status = "pending_signup";
  }

  rows.push({
    full_name: enrollee.full_name,
    email,
    status,
    progress_percent: clerkEnrollment?.progress_percent ?? legacyEnrollment?.progress_percent ?? null,
    enrolled_at: clerkEnrollment?.enrolled_at ?? legacyEnrollment?.enrolled_at ?? null,
  });
}

rows.sort((a, b) => a.full_name.localeCompare(b.full_name, undefined, { sensitivity: "base" }));

mkdirSync(outDir, { recursive: true });

const jsonPath = join(outDir, "hpcc-legacy-enrollees.json");
const csvPath = join(outDir, "hpcc-legacy-enrollees.csv");

writeFileSync(jsonPath, JSON.stringify(rows, null, 2), "utf8");

const csvHeader = "full_name,email,status,progress_percent,enrolled_at";
const csvBody = rows
  .map((row) =>
    [
      csvEscape(row.full_name),
      csvEscape(row.email),
      csvEscape(row.status),
      csvEscape(row.progress_percent ?? ""),
      csvEscape(row.enrolled_at ?? ""),
    ].join(","),
  )
  .join("\n");
writeFileSync(csvPath, `${csvHeader}\n${csvBody}\n`, "utf8");

const summary = {
  total: rows.length,
  claimed: rows.filter((r) => r.status === "claimed").length,
  pending_signup: rows.filter((r) => r.status === "pending_signup").length,
  not_in_database: rows.filter((r) => r.status === "not_in_database").length,
  csv: csvPath,
  json: jsonPath,
};

console.log(JSON.stringify(summary, null, 2));
