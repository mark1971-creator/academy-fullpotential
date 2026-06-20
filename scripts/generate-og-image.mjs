// Build a 1200×630 Open Graph image for HPCC social sharing.
// Run: npm run generate:og-image

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/** Bump when the visual changes so social platforms refetch the image. */
const OG_IMAGE_VERSION = "3";

const OUT_W = 1200;
const OUT_H = 630;
/** Render at 2× then downscale for sharper text and edges. */
const SCALE = 2;
const W = OUT_W * SCALE;
const H = OUT_H * SCALE;

const TOP_BAR = 112 * SCALE;
const BOTTOM_BAR = 68 * SCALE;
const CONTENT_H = H - TOP_BAR - BOTTOM_BAR;
const PAD_X = 28 * SCALE;
const SAFE_TOP = 14 * SCALE;

const SRC = join(
  process.cwd(),
  "public",
  "Images",
  "courses",
  "human-potential-coach-certification-source.png",
);
const OUT_DIR = join(process.cwd(), "public", "Images", "og");
const OUT = join(OUT_DIR, "academy-hpcc-og.jpg");

/**
 * Crop below all baked-in titles in the course banner.
 * Keeps the ICF badge + full iceberg diagram only.
 */
const SRC_CROP_TOP = 248;
const SRC_CROP_SIDE = 48;

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function backgroundSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#061428"/>
      <stop offset="45%" stop-color="#0b2342"/>
      <stop offset="100%" stop-color="#040d1a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="58%" r="52%">
      <stop offset="0%" stop-color="#1a6b8a" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#061428" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);
}

function topBarSvg() {
  const line1 = escapeXml("HUMAN POTENTIAL");
  const line2 = escapeXml("COACH CERTIFICATION");
  const fontSize = 30 * SCALE;
  const lineGap = 36 * SCALE;
  const y1 = SAFE_TOP + fontSize;
  const y2 = y1 + lineGap;

  return Buffer.from(`<svg width="${W}" height="${TOP_BAR}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#040d1a"/>
      <stop offset="100%" stop-color="#0b2342" stop-opacity="0.88"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${TOP_BAR}" fill="url(#topBar)"/>
  <line x1="${PAD_X}" y1="${TOP_BAR - 2 * SCALE}" x2="${W - PAD_X}" y2="${TOP_BAR - 2 * SCALE}" stroke="#c9a227" stroke-width="${2 * SCALE}" opacity="0.9"/>
  <text x="${W / 2}" y="${y1}" text-anchor="middle" fill="#f8f4eb" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="400" letter-spacing="${4 * SCALE}">${line1}</text>
  <text x="${W / 2}" y="${y2}" text-anchor="middle" fill="#e8c56a" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="400" letter-spacing="${4 * SCALE}">${line2}</text>
</svg>`);
}

function bottomBarSvg() {
  const subtitle = escapeXml("BEING at Full Potential Academy");
  return Buffer.from(`<svg width="${W}" height="${BOTTOM_BAR}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bottomBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b2342" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#040d1a"/>
    </linearGradient>
  </defs>
  <line x1="${PAD_X}" y1="${2 * SCALE}" x2="${W - PAD_X}" y2="${2 * SCALE}" stroke="#c9a227" stroke-width="${2 * SCALE}" opacity="0.9"/>
  <rect width="${W}" height="${BOTTOM_BAR}" fill="url(#bottomBar)"/>
  <text x="${W / 2}" y="${44 * SCALE}" text-anchor="middle" fill="#e8c56a" font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-size="${24 * SCALE}" font-weight="600" letter-spacing="${2.5 * SCALE}">${subtitle}</text>
</svg>`);
}

await mkdir(OUT_DIR, { recursive: true });

const srcMeta = await sharp(SRC).metadata();
const srcW = srcMeta.width ?? 1536;
const srcH = srcMeta.height ?? 1024;
const cropTop = Math.min(SRC_CROP_TOP, srcH - 2);
const cropLeft = Math.min(SRC_CROP_SIDE, Math.floor(srcW / 2));
const cropWidth = srcW - cropLeft * 2;
const cropHeight = srcH - cropTop;

const iceberg = await sharp(SRC)
  .extract({
    left: cropLeft,
    top: cropTop,
    width: cropWidth,
    height: cropHeight,
  })
  .resize(W - PAD_X * 2, CONTENT_H, {
    fit: "inside",
    position: "centre",
    kernel: sharp.kernel.lanczos3,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const icebergMeta = await sharp(iceberg).metadata();
const icebergW = icebergMeta.width ?? W - PAD_X * 2;
const icebergH = icebergMeta.height ?? CONTENT_H;
const icebergLeft = Math.round((W - icebergW) / 2);
const icebergTop = TOP_BAR + Math.round((CONTENT_H - icebergH) / 2);

const composite = await sharp(backgroundSvg())
  .composite([
    { input: iceberg, left: icebergLeft, top: icebergTop },
    { input: topBarSvg(), left: 0, top: 0 },
    { input: bottomBarSvg(), left: 0, top: H - BOTTOM_BAR },
  ])
  .png()
  .toBuffer();

await sharp(composite)
  .resize(OUT_W, OUT_H, { kernel: sharp.kernel.lanczos3 })
  .jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

const { width, height, size } = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} (${width}×${height}, ${Math.round((size ?? 0) / 1024)} KB)`);
