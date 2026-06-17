import { readFileSync, existsSync } from "node:fs";

const file = process.argv[2] ?? ".env.preview.pull";
if (!existsSync(file)) {
  console.error("File not found:", file);
  process.exit(1);
}

for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  console.log(`${key}: ${val.length} chars`);
}
