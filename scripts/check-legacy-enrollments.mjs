import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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

const { count: legacyProfiles } = await sb
  .from("profiles")
  .select("id", { count: "exact", head: true })
  .like("id", "legacy:%");

const { count: legacyEnrollments } = await sb
  .from("enrollments")
  .select("id", { count: "exact", head: true })
  .like("user_id", "legacy:%");

const { data: course } = await sb
  .from("courses")
  .select("id, slug")
  .eq("slug", "human-potential-coach-certification")
  .single();

const { count: hpccEnrollments } = await sb
  .from("enrollments")
  .select("id", { count: "exact", head: true })
  .eq("course_id", course.id);

const { data: sample } = await sb
  .from("profiles")
  .select("id, email")
  .like("id", "legacy:%")
  .limit(5);

const { data: enrollments } = await sb
  .from("enrollments")
  .select("user_id")
  .eq("course_id", course.id);

const clerkEnrollments = (enrollments ?? []).filter((e) => !e.user_id.startsWith("legacy:"));
const legacyOnly = (enrollments ?? []).filter((e) => e.user_id.startsWith("legacy:"));

console.log(
  JSON.stringify(
    {
      supabaseHost: new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      legacyProfiles,
      legacyEnrollments,
      hpccEnrollments,
      claimedToClerk: clerkEnrollments.length,
      clerkUserIds: clerkEnrollments.map((e) => e.user_id),
      sample,
    },
    null,
    2,
  ),
);
