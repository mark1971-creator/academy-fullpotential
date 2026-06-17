// Applies pending SQL migrations via the Supabase Management API / direct postgres.
// Fallback: run supabase/migrations/20250617000000_course_preview_fields.sql in the SQL editor.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return env;
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

  // Probe: tagline column exists?
  const { error: probeError } = await db.from("courses").select("tagline").limit(1);
  if (!probeError) {
    console.log("Preview columns already exist — nothing to apply.");
    return;
  }

  console.log(
    "Missing preview columns (tagline, who_this_is_for, testimonials).\n" +
      "Apply this SQL in Supabase → SQL Editor → New query → Run:\n",
  );
  const migrationPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "supabase",
    "migrations",
    "20250617000000_course_preview_fields.sql",
  );
  console.log(readFileSync(migrationPath, "utf8"));
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
