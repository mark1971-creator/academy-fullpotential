import { readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const COURSES_DIR = join(process.cwd(), "public", "Images", "courses");
const WIDTH = 1600;
const HEIGHT = 1000;
const WEBP_QUALITY = 82;

async function optimizeImage(filename) {
  if (!filename.toLowerCase().endsWith(".png")) return null;

  const inputPath = join(COURSES_DIR, filename);
  const outputName = filename.replace(/\.png$/i, ".webp");
  const outputPath = join(COURSES_DIR, outputName);

  const inputMeta = await sharp(inputPath).metadata();
  const inputStats = await import("node:fs/promises").then((fs) =>
    fs.stat(inputPath),
  );

  await sharp(inputPath)
    .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outputPath);

  await unlink(inputPath);

  const outputStats = await import("node:fs/promises").then((fs) =>
    fs.stat(outputPath),
  );

  return {
    name: outputName,
    beforeKb: Math.round(inputStats.size / 1024),
    afterKb: Math.round(outputStats.size / 1024),
    dimensions: `${inputMeta.width}x${inputMeta.height} → ${WIDTH}x${HEIGHT}`,
  };
}

async function main() {
  const files = await readdir(COURSES_DIR);
  const results = [];

  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) results.push(result);
  }

  if (results.length === 0) {
    console.log("No PNG files found to optimize.");
    return;
  }

  console.log("Optimized course thumbnails:\n");
  for (const r of results) {
    const saved = Math.round((1 - r.afterKb / r.beforeKb) * 100);
    console.log(
      `  ${r.name}: ${r.beforeKb} KB → ${r.afterKb} KB (${saved}% smaller, ${r.dimensions})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
