// Seeds all course records + module titles via the service-role API.
// Run BEFORE seed_lessons.mjs (HPCC lessons only for now). Idempotent per course.
//
// Run from the project root:   node supabase/seed_course_meta.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

import { SEED_COURSES } from "./seed-data/courses.mjs";

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

const PREVIEW_ONLY_COLUMNS = ["tagline", "who_this_is_for", "testimonials"];

async function upsertCourse(db, course) {
  let payload = { ...course };
  let { data, error } = await db
    .from("courses")
    .upsert(payload, { onConflict: "slug" })
    .select("id, slug, title, is_published")
    .single();

  if (error?.message?.includes("tagline")) {
    console.warn(
      "Preview columns missing — run supabase/migrations/20250617000000_course_preview_fields.sql in the SQL editor, then re-seed.",
    );
    for (const key of PREVIEW_ONLY_COLUMNS) delete payload[key];
    ({ data, error } = await db
      .from("courses")
      .upsert(payload, { onConflict: "slug" })
      .select("id, slug, title, is_published")
      .single());
  }

  if (error) throw error;
  return data;
}

async function seedCourse(db, { course, moduleTitles }) {
  const row = await upsertCourse(db, course);

  if (moduleTitles.length === 0) {
    console.log(`Upserted course (no modules): ${row.slug} [${row.id}]`);
    return row;
  }

  const { data: existingModules, error: existingErr } = await db
    .from("modules")
    .select("id, sort_order, title")
    .eq("course_id", row.id);
  if (existingErr) throw existingErr;

  const modulesByOrder = new Map(
    (existingModules ?? []).map((module) => [module.sort_order, module]),
  );

  for (const [sort_order, title] of moduleTitles) {
    const existing = modulesByOrder.get(sort_order);
    if (existing) {
      if (existing.title !== title) {
        const { error: updateErr } = await db
          .from("modules")
          .update({ title })
          .eq("id", existing.id);
        if (updateErr) throw updateErr;
      }
      modulesByOrder.delete(sort_order);
      continue;
    }

    const { error: insertErr } = await db
      .from("modules")
      .insert({ course_id: row.id, title, sort_order });
    if (insertErr) throw insertErr;
  }

  for (const orphan of modulesByOrder.values()) {
    const { error: deleteErr } = await db.from("modules").delete().eq("id", orphan.id);
    if (deleteErr) throw deleteErr;
  }

  console.log(
    `Upserted course: ${row.slug} — ${moduleTitles.length} modules` +
      (row.is_published ? "" : " (unpublished)"),
  );

  return row;
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

  for (const entry of SEED_COURSES) {
    await seedCourse(db, entry);
  }

  console.log(`Done — processed ${SEED_COURSES.length} courses.`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message ?? err);
  process.exit(1);
});
