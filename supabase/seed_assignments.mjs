// Seeds module-level assignments for one or all courses with curriculum data.
// Idempotent per module — updates title/description, preserves file URLs.
//
// Run from project root:
//   node supabase/seed_assignments.mjs --all
//   node supabase/seed_assignments.mjs --slug breakthroughs-employee-experience

import { createClient } from "@supabase/supabase-js";

import { COURSE_CURRICULUM, CURRICULUM_COURSE_SLUGS } from "./seed-data/course-curriculum.mjs";
import { loadEnv, parseSlugArg, wantsAll } from "./seed-utils.mjs";

async function seedAssignmentsForCourse(db, slug) {
  const curriculum = COURSE_CURRICULUM[slug];
  if (!curriculum) {
    throw new Error(`No curriculum defined for slug: ${slug}`);
  }

  const { data: course, error: courseError } = await db
    .from("courses")
    .select("id, title")
    .eq("slug", slug)
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) throw new Error(`Course not found: ${slug}`);

  const { data: modules, error: modulesError } = await db
    .from("modules")
    .select("id, sort_order, title")
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });
  if (modulesError) throw modulesError;

  const moduleByOrder = new Map((modules ?? []).map((m) => [m.sort_order, m]));
  let created = 0;
  let updated = 0;

  for (const assignment of curriculum.assignments) {
    const module = moduleByOrder.get(assignment.sort_order);
    if (!module) {
      console.warn(`${slug}: skip module ${assignment.sort_order} (not found)`);
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
    } else {
      const { error: insertError } = await db.from("assignments").insert(payload);
      if (insertError) throw insertError;
      created += 1;
    }
  }

  console.log(`${slug}: ${created} created, ${updated} updated — ${course.title}`);
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

  const slug = parseSlugArg(process.argv);
  const slugs = wantsAll(process.argv)
    ? CURRICULUM_COURSE_SLUGS
    : slug
      ? [slug]
      : ["human-potential-coach-certification"];

  if (!wantsAll(process.argv) && !slug) {
    console.log("Seeding HPCC assignments only (pass --all or --slug <slug>)");
  }

  for (const courseSlug of slugs) {
    await seedAssignmentsForCourse(db, courseSlug);
  }

  console.log("Assignment seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
