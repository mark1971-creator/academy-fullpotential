import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function loadEnv() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const raw = readFileSync(join(root, ".env.local"), "utf8");
  /** @type {Record<string, string>} */
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

export function parseSlugArg(argv, flag = "--slug") {
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === flag && argv[i + 1]) {
      return argv[i + 1];
    }
  }
  return null;
}

export function wantsAll(argv) {
  return argv.includes("--all");
}
