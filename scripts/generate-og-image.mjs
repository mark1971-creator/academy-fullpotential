// Build a 1200×630 Open Graph image for HPCC social sharing.
// Run: npm run generate:og-image

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;
const TOP_BAR = 92;
const BOTTOM_BAR = 76;
const CONTENT_H = H - TOP_BAR - BOTTOM_BAR;
const PAD_X = 24;

const SRC = join(
  process.cwd(),
  "public",
  "Images",
  "courses",
  "human-potential-coach-certification-source.png",
);
const OUT_DIR = join(process.cwd(), "public", "Images", "og");
const OUT = join(OUT_DIR, "academy-hpcc-og.jpg");

/** Remove the title baked into the course banner so we can render crisp OG typography. */
const SRC_CROP_TOP = 168;

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
    <radialGradient id="glow" cx="50%" cy="62%" r="48%">
      <stop offset="0%" stop-color="#1a6b8a" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#061428" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);
}

function topBarSvg() {
  const title = escapeXml("HUMAN POTENTIAL COACH CERTIFICATION");
  return Buffer.from(`<svg width="${W}" height="${TOP_BAR}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#040d1a" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#0b2342" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${TOP_BAR}" fill="url(#topBar)"/>
  <line x1="${PAD_X}" y1="${TOP_BAR - 2}" x2="${W - PAD_X}" y2="${TOP_BAR - 2}" stroke="#c9a227" stroke-width="1.5" opacity="0.85"/>
  <text
    x="${W / 2}"
    y="58"
    text-anchor="middle"
    fill="#f5f0e6"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="34"
    font-weight="400"
    letter-spacing="3.5"
  >${title}</text>
</svg>`);
}

function bottomBarSvg() {
  const subtitle = escapeXml("BEING at Full Potential Academy");
  return Buffer.from(`<svg width="${W}" height="${BOTTOM_BAR}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bottomBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0b2342" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#040d1a" stop-opacity="0.98"/>
    </linearGradient>
  </defs>
  <line x1="${PAD_X}" y1="2" x2="${W - PAD_X}" y2="2" stroke="#c9a227" stroke-width="1.5" opacity="0.85"/>
  <rect width="${W}" height="${BOTTOM_BAR}" fill="url(#bottomBar)"/>
  <text
    x="${W / 2}"
    y="48"
    text-anchor="middle"
    fill="#e8c56a"
    font-family="'Segoe UI', Arial, Helvetica, sans-serif"
    font-size="26"
    font-weight="600"
    letter-spacing="2.2"
  >${subtitle}</text>
</svg>`);
}

await mkdir(OUT_DIR, { recursive: true });

const srcMeta = await sharp(SRC).metadata();
const cropTop = Math.min(SRC_CROP_TOP, (srcMeta.height ?? 1024) - 1);
const cropHeight = (srcMeta.height ?? 1024) - cropTop;

const iceberg = await sharp(SRC)
  .extract({
    left: 0,
    top: cropTop,
    width: srcMeta.width ?? 1536,
    height: cropHeight,
  })
  .resize(W - PAD_X * 2, CONTENT_H, {
    fit: "contain",
    position: "centre",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .sharpen({ sigma: 0.6, m1: 0.5, m2: 0.25 })
  .png()
  .toBuffer();

const icebergMeta = await sharp(iceberg).metadata();
const icebergW = icebergMeta.width ?? W - PAD_X * 2;
const icebergH = icebergMeta.height ?? CONTENT_H;
const icebergLeft = Math.round((W - icebergW) / 2);
const icebergTop = TOP_BAR + Math.round((CONTENT_H - icebergH) / 2);

await sharp(backgroundSvg())
  .composite([
    { input: iceberg, left: icebergLeft, top: icebergTop },
    { input: topBarSvg(), left: 0, top: 0 },
    { input: bottomBarSvg(), left: 0, top: H - BOTTOM_BAR },
  ])
  .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(OUT);

const { width, height, size } = await sharp(OUT).metadata();
console.log(`Wrote ${OUT} (${width}×${height}, ${Math.round((size ?? 0) / 1024)} KB)`);
