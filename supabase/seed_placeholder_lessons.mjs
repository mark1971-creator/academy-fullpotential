// Seeds one placeholder resource lesson per module for non-HPCC courses.
// Skips modules that already have lessons (e.g. after real content is added).
//
// Run from project root after seed_course_meta.mjs:
//   node supabase/seed_placeholder_lessons.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  PLACEHOLDER_COURSE_SLUGS,
  PLACEHOLDER_LESSON_CONTENT,
  buildPlaceholderLessonTitle,
} from "./seed-data/placeholder-lessons.mjs";

function loadEnv() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function seedPlaceholdersForCourse(db, slug) {
  const { data: course, error: cErr } = await db
    .from("courses")
    .select("id, slug, title")
    .eq("slug", slug)
    .maybeSingle();
  if (cErr) throw cErr;
  if (!course) {
    console.log(`Skip ${slug}: course not found`);
    return;
  }

  const { data: modules, error: mErr } = await db
    .from("modules")
    .select("id, title, sort_order")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });
  if (mErr) throw mErr;

  if (!modules?.length) {
    console.log(`Skip ${slug}: no modules`);
    return;
  }

  let inserted = 0;
  let skipped = 0;

  for (const module of modules) {
    const { count, error: countErr } = await db
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("module_id", module.id);
    if (countErr) throw countErr;

    if ((count ?? 0) > 0) {
      skipped += 1;
      continue;
    }

    const { error: insErr } = await db.from("lessons").insert({
      module_id: module.id,
      title: buildPlaceholderLessonTitle(module.title),
      youtube_url: null,
      lesson_type: "resource",
      duration_label: null,
      duration_minutes: null,
      content: PLACEHOLDER_LESSON_CONTENT,
      sort_order: 1,
    });
    if (insErr) throw insErr;
    inserted += 1;
  }

  console.log(
    `${slug}: ${inserted} placeholder lesson(s) inserted` +
      (skipped > 0 ? `, ${skipped} module(s) already had lessons` : ""),
  );
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const db = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const slug of PLACEHOLDER_COURSE_SLUGS) {
    await seedPlaceholdersForCourse(db, slug);
  }

  console.log("Placeholder lesson seed complete.");
}

main().catch((err) => {
  console.error("Placeholder seed failed:", err.message ?? err);
  process.exit(1);
});
