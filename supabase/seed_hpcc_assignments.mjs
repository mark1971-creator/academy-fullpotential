// Back-compat wrapper — prefer: node supabase/seed_assignments.mjs

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = ["supabase/seed_assignments.mjs", ...process.argv.slice(2)];

const result = spawnSync("node", args, { cwd: root, stdio: "inherit", shell: true });
process.exit(result.status ?? 1);
