// Seeds lessons for one or all courses with curriculum data.
//
// Run from project root:
//   node supabase/seed_lessons.mjs --all
//   node supabase/seed_lessons.mjs --slug human-potential-team-coach-certification

import { createClient } from "@supabase/supabase-js";

import { COURSE_CURRICULUM, CURRICULUM_COURSE_SLUGS } from "./seed-data/course-curriculum.mjs";
import { loadEnv, parseSlugArg, wantsAll } from "./seed-utils.mjs";

async function seedLessonsForCourse(db, slug) {
  const curriculum = COURSE_CURRICULUM[slug];
  if (!curriculum) {
    throw new Error(`No curriculum defined for slug: ${slug}`);
  }

  const { data: course, error: cErr } = await db
    .from("courses")
    .select("id, title")
    .eq("slug", slug)
    .single();
  if (cErr) throw cErr;

  const { data: modules, error: mErr } = await db
    .from("modules")
    .select("id, sort_order")
    .eq("course_id", course.id);
  if (mErr) throw mErr;

  const moduleId = new Map((modules ?? []).map((m) => [m.sort_order, m.id]));
  const moduleIds = (modules ?? []).map((m) => m.id);

  const { error: dErr } = await db.from("lessons").delete().in("module_id", moduleIds);
  if (dErr) throw dErr;

  const rows = curriculum.lessons.map(
    ([order, title, yt, type, durLabel, durMin, content, sort]) => {
      const mid = moduleId.get(order);
      if (!mid) throw new Error(`${slug}: no module with sort_order ${order}`);
      return {
        module_id: mid,
        title,
        youtube_url: yt,
        lesson_type: type,
        duration_label: durLabel,
        duration_minutes: durMin,
        content,
        sort_order: sort,
      };
    },
  );

  const { error: iErr } = await db.from("lessons").insert(rows);
  if (iErr) throw iErr;

  const { count, error: vErr } = await db
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .in("module_id", moduleIds);
  if (vErr) throw vErr;

  console.log(`${slug}: inserted ${rows.length} lesson(s), total now ${count}`);
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

  const slug = parseSlugArg(process.argv);
  const slugs = wantsAll(process.argv) ? CURRICULUM_COURSE_SLUGS : slug ? [slug] : ["human-potential-coach-certification"];

  if (!wantsAll(process.argv) && !slug) {
    console.log("Seeding HPCC only (pass --all or --slug <slug>)");
  }

  for (const courseSlug of slugs) {
    await seedLessonsForCourse(db, courseSlug);
  }

  console.log("Lesson seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err.message ?? err);
  process.exit(1);
});
