// Probes for assignment resource columns and prints migration SQL if missing.
// Apply in Supabase → SQL Editor, then run: npm run seed:hpcc-assignments
//
// Optional: set SUPABASE_DB_URL (postgres connection string) to apply automatically.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const MIGRATION_FILE = "20250618000000_assignment_resources.sql";

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

async function applyWithPg(connectionString, sql) {
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const db = createClient(url, serviceKey);
  const { error: probeError } = await db.from("assignments").select("resource_files").limit(1);

  if (!probeError) {
    console.log("Assignment resource columns already exist — nothing to apply.");
    return;
  }

  const migrationPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "supabase",
    "migrations",
    MIGRATION_FILE,
  );
  const sql = readFileSync(migrationPath, "utf8");

  if (env.SUPABASE_DB_URL) {
    console.log("Applying migration via SUPABASE_DB_URL…");
    await applyWithPg(env.SUPABASE_DB_URL, sql);
    console.log("Migration applied. Run: npm run seed:hpcc-assignments");
    return;
  }

  console.log(
    "Missing assignment resource columns (resource_files, optional file_url/file_type).\n" +
      "Apply this SQL in Supabase → SQL Editor → New query → Run:\n",
  );
  console.log(sql);
  console.log(
    "\nThen run: npm run seed:hpcc-assignments\n" +
      "Tip: add SUPABASE_DB_URL to .env.local to apply migrations from this script automatically.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
