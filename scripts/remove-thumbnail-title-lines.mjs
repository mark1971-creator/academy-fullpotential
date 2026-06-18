// Remove decorative gold rules above/below titles on custom course thumbnails.
// Run: node scripts/remove-thumbnail-title-lines.mjs

import { join } from "node:path";
import sharp from "sharp";

const COURSES_DIR = join(process.cwd(), "public", "Images", "courses");
const WIDTH = 1600;
const HEIGHT = 1000;

/** @typedef {{ source: string, webp: string, bands: Array<{ y0: number, y1: number, refY: number }> }} ThumbnailEdit */

/** @type {ThumbnailEdit[]} */
const EDITS = [
  {
    source: "human-potential-team-coach-certification-source.png",
    webp: "human-potential-team-coach-certification.webp",
    bands: [
      { y0: 55, y1: 80, refY: 45 },
      { y0: 272, y1: 281, refY: 290 },
    ],
  },
  {
    source: "breakthroughs-employee-experience-source.png",
    webp: "breakthroughs-employee-experience.webp",
    bands: [
      { y0: 38, y1: 49, refY: 30 },
      { y0: 200, y1: 209, refY: 215 },
    ],
  },
];

function isGold(r, g, b) {
  return r > 160 && g > 120 && b < 120 && r > b + 40;
}

async function removeGoldBands(inputPath, bands) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  for (const { y0, y1, refY } of bands) {
    for (let y = y0; y <= y1; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        if (!isGold(r, g, b)) continue;

        const refI = (refY * width + x) * channels;
        pixels[i] = pixels[refI];
        pixels[i + 1] = pixels[refI + 1];
        pixels[i + 2] = pixels[refI + 2];
        if (channels === 4) pixels[i + 3] = pixels[refI + 3];
      }
    }
  }

  return sharp(pixels, { raw: { width, height, channels } }).png();
}

async function main() {
  for (const edit of EDITS) {
    const sourcePath = join(COURSES_DIR, edit.source);
    const webpPath = join(COURSES_DIR, edit.webp);

    const pngPipeline = await removeGoldBands(sourcePath, edit.bands);

    await pngPipeline.clone().toFile(sourcePath);
    await pngPipeline
      .clone()
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .webp({ quality: 84, effort: 6 })
      .toFile(webpPath);

    console.log(`Updated ${edit.webp} (gold title rules removed)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
