// Seeds one module-level assignment per HPCC module (instructions; files added separately).
// Idempotent per module — updates title/description, preserves file URLs.
//
// Run from project root:   node supabase/seed_hpcc_assignments.mjs

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

import { HPCC_MODULE_ASSIGNMENTS } from "./seed-data/hpcc-module-assignments.mjs";

const COURSE_SLUG = "human-potential-coach-certification";

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

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }

  const db = createClient(url, serviceKey);

  const { data: course, error: courseError } = await db
    .from("courses")
    .select("id, title")
    .eq("slug", COURSE_SLUG)
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) throw new Error(`Course not found: ${COURSE_SLUG}`);

  const { data: modules, error: modulesError } = await db
    .from("modules")
    .select("id, sort_order, title")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });
  if (modulesError) throw modulesError;

  const moduleByOrder = new Map((modules ?? []).map((m) => [m.sort_order, m]));
  let created = 0;
  let updated = 0;

  for (const assignment of HPCC_MODULE_ASSIGNMENTS) {
    const module = moduleByOrder.get(assignment.sort_order);
    if (!module) {
      console.warn(`Skip module ${assignment.sort_order}: not found`);
      continue;
    }

    const { data: existing, error: existingError } = await db
      .from("assignments")
      .select("id, file_url, file_type, resource_files")
      .eq("module_id", module.id)
      .is("lesson_id", null)
      .maybeSingle();
    if (existingError) throw existingError;

    const payload = {
      module_id: module.id,
      lesson_id: null,
      title: assignment.title,
      description: assignment.description,
      file_url: existing?.file_url ?? null,
      file_type: existing?.file_type ?? null,
      resource_files: existing?.resource_files ?? [],
    };

    if (existing) {
      const { error: updateError } = await db
        .from("assignments")
        .update({
          title: payload.title,
          description: payload.description,
        })
        .eq("id", existing.id);
      if (updateError) throw updateError;
      updated += 1;
      console.log(`Updated assignment: module ${assignment.sort_order}`);
    } else {
      const { error: insertError } = await db.from("assignments").insert(payload);
      if (insertError) throw insertError;
      created += 1;
      console.log(`Created assignment: module ${assignment.sort_order}`);
    }
  }

  console.log(`\nDone — ${created} created, ${updated} updated for ${course.title}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
