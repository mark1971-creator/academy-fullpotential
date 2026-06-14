// Seeds the course record + the 11 modules (full metadata, real titles) via the
// service-role API. Run BEFORE seed_lessons.mjs. Idempotent: upserts the course
// and recreates the modules. We use the API because the Supabase SQL editor
// mangles the word "the" in string literals.
//
// Run from the project root:   node supabase/seed_course_meta.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

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

const COURSE = {
  slug: COURSE_SLUG,
  image_url: null,
  hero_video_url: null,
  title: "Certification - Human Potential Development Coach Training",
  description:
    "Welcome and thank you for enrolling for this certification training. If you work with leaders, teams & organizations you will probably agree that much of our Human Potential remains dormant or unexpressed in the work environment. This program equips you to debrief assessments, build business cases for human potential development, and guide transformational client work.",
  price: 995.0,
  is_published: true,
  duration_label: "24 hours",
  level: "Expert",
  rating: 5.0,
  rating_count: 10,
  enrolled_count: 86,
  what_you_will_learn: [
    "Debrief the Human Potential assessment with your clients",
    "Clearly demonstrate how a greater focus on HUMAN POTENTIAL REALIZATION drives key business metrics such as: employee engagement, trustworthiness & innovation",
    "Offer very concrete tools and methodologies that bring more objectivity to the subjective nature of human beings",
    "Make a robust business case for HUMAN POTENTIAL DEVELOPMENT and expand your effectiveness in OD work",
    "Inspire your clients to bring more focus and attention on the HUMAN DIMENSION in their organizations",
    "Gain insights that will allow you to access even more of your human potential and grow into your next stage of personal development in life",
  ],
  tags: [
    "Coaching",
    "Conscious Culture",
    "Human Potential",
    "Leadership development",
    "Organizational development",
    "Personal development",
  ],
};

// [sort_order, title]
const MODULE_TITLES = [
  [1, "Module 1: Authentic introductions"],
  [2, "Module 2: Context for Human Potential interventions"],
  [3, "Module 3: The Human Potential Iceberg"],
  [4, "Module 4: Using the 6 OPM's to build bridges into the client's reality"],
  [5, "Module 5: Understanding the Human Potential House"],
  [6, "Module 6: Using the 4 States and 23 Dimensions to uncover deeper insight into the client's reality"],
  [7, "Module 7: The 8 Being Attitudes"],
  [8, "Module 8: Consciousness Maturity Index"],
  [9, "Module 9: Additional findings"],
  [10, "Module 10: Debriefing clients on their full report"],
  [11, "Module 11: Closing, next steps & certification"],
];

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

  // 1. Upsert course (create if missing, otherwise refresh metadata)
  const { data: course, error: cErr } = await db
    .from("courses")
    .upsert(COURSE, { onConflict: "slug" })
    .select("id")
    .single();
  if (cErr) throw cErr;
  console.log("Upserted course:", course.id);

  // 2. Recreate modules (the modules table has no natural unique key beyond id,
  //    so we clear and re-insert). This cascades to lessons, which the lessons
  //    seeder re-inserts afterwards.
  const { error: delErr } = await db.from("modules").delete().eq("course_id", course.id);
  if (delErr) throw delErr;

  const moduleRows = MODULE_TITLES.map(([sort_order, title]) => ({
    course_id: course.id,
    title,
    sort_order,
  }));
  const { error: insErr } = await db.from("modules").insert(moduleRows);
  if (insErr) throw insErr;
  console.log(`Inserted ${moduleRows.length} modules`);
}

main().catch((err) => {
  console.error("Update failed:", err.message ?? err);
  process.exit(1);
});
