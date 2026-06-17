// Attach a PDF or Word file to an HPCC module assignment in Supabase Storage.
//
// Usage:
//   node scripts/upload-assignment-file.mjs --module 1 --file ./worksheet.pdf
//   node scripts/upload-assignment-file.mjs --module 3 --file ./iceberg.docx --title "Iceberg worksheet"
//
// Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
// Run migration 20250618000000_assignment_resources.sql first.

import { readFileSync, existsSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createClient } from "@supabase/supabase-js";

const COURSE_SLUG = "human-potential-coach-certification";
const BUCKET = "assignments";

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

function parseArgs(argv) {
  const args = { module: null, file: null, title: null, primary: false };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--module" && value) {
      args.module = Number.parseInt(value, 10);
      i += 1;
    } else if (key === "--file" && value) {
      args.file = value;
      i += 1;
    } else if (key === "--title" && value) {
      args.title = value;
      i += 1;
    } else if (key === "--primary") {
      args.primary = true;
    }
  }
  return args;
}

function fileTypeFromPath(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".pdf") return "pdf";
  if (ext === ".doc") return "doc";
  if (ext === ".docx") return "docx";
  throw new Error(`Unsupported file type: ${ext} (use .pdf, .doc, or .docx)`);
}

async function main() {
  const { module: moduleOrder, file, title, primary } = parseArgs(process.argv);
  if (!moduleOrder || !file) {
    console.error(
      "Usage: node scripts/upload-assignment-file.mjs --module <1-11> --file <path> [--title \"Label\"] [--primary]",
    );
    process.exit(1);
  }

  if (!existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase env vars in .env.local");
  }

  const db = createClient(url, serviceKey);
  const fileType = fileTypeFromPath(file);
  const fileName = basename(file);
  const displayTitle = title ?? fileName;
  const storagePath = `${COURSE_SLUG}/module-${moduleOrder}/${Date.now()}-${fileName}`;
  const fileBuffer = readFileSync(file);

  const { data: course, error: courseError } = await db
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .maybeSingle();
  if (courseError) throw courseError;
  if (!course) throw new Error(`Course not found: ${COURSE_SLUG}`);

  const { data: module, error: moduleError } = await db
    .from("modules")
    .select("id")
    .eq("course_id", course.id)
    .eq("sort_order", moduleOrder)
    .maybeSingle();
  if (moduleError) throw moduleError;
  if (!module) throw new Error(`Module ${moduleOrder} not found`);

  const { data: assignment, error: assignmentError } = await db
    .from("assignments")
    .select("id, file_url, file_type, resource_files")
    .eq("module_id", module.id)
    .is("lesson_id", null)
    .maybeSingle();
  if (assignmentError) throw assignmentError;
  if (!assignment) {
    throw new Error(
      `No module assignment found for module ${moduleOrder}. Run: node supabase/seed_hpcc_assignments.mjs`,
    );
  }

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType:
        fileType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      upsert: true,
    });
  if (uploadError) throw uploadError;

  const { data: publicUrlData } = db.storage.from(BUCKET).getPublicUrl(storagePath);
  const publicUrl = publicUrlData.publicUrl;

  const resourceEntry = {
    title: displayTitle,
    file_url: publicUrl,
    file_type: fileType,
  };

  let updatePayload;
  if (primary || !assignment.file_url) {
    updatePayload = {
      file_url: publicUrl,
      file_type: fileType,
    };
  } else {
    const existingResources = Array.isArray(assignment.resource_files)
      ? assignment.resource_files
      : [];
    updatePayload = {
      resource_files: [...existingResources, resourceEntry],
    };
  }

  const { error: updateError } = await db
    .from("assignments")
    .update(updatePayload)
    .eq("id", assignment.id);
  if (updateError) throw updateError;

  console.log(`Uploaded to: ${publicUrl}`);
  console.log(
    primary || !assignment.file_url
      ? "Set as primary assignment download."
      : "Added as additional resource file.",
  );
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
