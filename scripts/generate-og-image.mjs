// Build the 1200×630 social share image from the HPCC course banner.
// Run: npm run generate:og-image

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "public", "Images", "courses", "human-potential-coach-certification.webp");
const OUT_DIR = join(process.cwd(), "public", "Images", "og");
const OUT = join(OUT_DIR, "academy-hpcc-og.jpg");

await mkdir(OUT_DIR, { recursive: true });

await sharp(SRC)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 88 })
  .toFile(OUT);

const { width, height } = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} (${width}×${height})`);
