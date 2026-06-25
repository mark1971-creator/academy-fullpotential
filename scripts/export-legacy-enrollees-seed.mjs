#!/usr/bin/env node
// Export HPCC legacy enrollees from seed data (no Supabase required).
// Usage: node scripts/export-legacy-enrollees-seed.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { HPCC_LEGACY_ENROLLEES } from "../supabase/seed-data/hpcc-legacy-enrollees.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "exports");

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const seen = new Set();
const rows = [];

for (const enrollee of HPCC_LEGACY_ENROLLEES) {
  const email = enrollee.email.trim().toLowerCase();
  if (seen.has(email)) continue;
  seen.add(email);
  rows.push({ full_name: enrollee.full_name, email });
}

rows.sort((a, b) => a.full_name.localeCompare(b.full_name, undefined, { sensitivity: "base" }));

mkdirSync(outDir, { recursive: true });

const jsonPath = join(outDir, "hpcc-legacy-enrollees.json");
const csvPath = join(outDir, "hpcc-legacy-enrollees.csv");

writeFileSync(jsonPath, JSON.stringify(rows, null, 2), "utf8");

const csvHeader = "full_name,email";
const csvBody = rows.map((row) => `${csvEscape(row.full_name)},${csvEscape(row.email)}`).join("\n");
writeFileSync(csvPath, `${csvHeader}\n${csvBody}\n`, "utf8");

console.log(JSON.stringify({ total: rows.length, csv: csvPath, json: jsonPath }, null, 2));
