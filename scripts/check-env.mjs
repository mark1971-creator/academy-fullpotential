import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=(.*)$/);
  if (!m) continue;
  const key = m[1];
  let val = m[2].trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  const hint =
    key.includes("URL") && val
      ? val.startsWith("http")
        ? "ok"
        : "BAD"
      : val.length > 0
        ? "set"
        : "EMPTY";
  console.log(`${key}: ${hint} (${val.length} chars)`);
}
