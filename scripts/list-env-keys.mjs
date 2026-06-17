import { readFileSync } from "node:fs";

const lines = readFileSync(".env.local", "utf8").split(/\r?\n/);
console.log("Non-empty lines:", lines.filter((l) => l.trim() && !l.trim().startsWith("#")).length);

for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) {
    console.log("(invalid line, no =):", t.slice(0, 40));
    continue;
  }
  const key = t.slice(0, i).trim();
  let val = t.slice(i + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  console.log(`${key} | length: ${val.length}${val === "..." ? " (LITERAL PLACEHOLDER - replace with real key!)" : ""}`);
}
