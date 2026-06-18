// Generate abstract, high-contrast course thumbnails (1600×1000 WebP).
// Run: npm run generate:course-images

import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "Images", "courses");
const WIDTH = 1600;
const HEIGHT = 1000;

/** @typedef {{ slug: string, file: string, icfCceus?: number, buildSvg: () => string }} ThumbnailConfig */

// Custom art (do not overwrite with abstract SVG placeholders)
const SKIP_FILES = new Set([
  "from-fragmentation-to-wholeness.webp",
  "human-potential-coach-certification.webp",
  "idg-coach-certification.webp",
  "human-potential-team-coach-certification.webp",
  "breakthroughs-employee-experience.webp",
]);

/** @type {ThumbnailConfig[]} */
const COURSES = [
  {
    slug: "human-potential-coach-certification",
    file: "human-potential-coach-certification.webp",
    icfCceus: 25,
    buildSvg: () =>
      abstractSvg({
        bg: ["#06101f", "#12345c"],
        shapes: `
          <circle cx="1280" cy="180" r="340" fill="#f5c518" opacity="0.92"/>
          <circle cx="220" cy="820" r="260" fill="#ff5c38" opacity="0.78"/>
          <circle cx="980" cy="720" r="190" fill="#ffffff" opacity="0.12"/>
          <rect x="-120" y="420" width="1100" height="88" fill="#f5c518" opacity="0.22" transform="rotate(-18 430 464)"/>
          <rect x="680" y="-60" width="520" height="520" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.18" transform="rotate(32 940 200)"/>
          <path d="M 80 120 Q 520 380 260 620 T 120 900" fill="none" stroke="#3dd9c4" stroke-width="6" opacity="0.55"/>
        `,
        accent: "#f5c518",
        label: "Human Potential Coach",
        icfCceus: 25,
      }),
  },
  {
    slug: "idg-coach-certification",
    file: "idg-coach-certification.webp",
    icfCceus: 25,
    buildSvg: () =>
      abstractSvg({
        bg: ["#1a0a2e", "#3d1566"],
        shapes: `
          <polygon points="200,900 520,120 860,900" fill="#3dffa0" opacity="0.75"/>
          <circle cx="1180" cy="280" r="300" fill="#ff47a8" opacity="0.82"/>
          <rect x="100" y="80" width="420" height="420" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.2" transform="rotate(45 310 290)"/>
          <ellipse cx="1350" cy="780" rx="220" ry="140" fill="#3dffa0" opacity="0.35"/>
        `,
        accent: "#3dffa0",
        label: "IDG Coach Certification",
        icfCceus: 25,
      }),
  },
  {
    slug: "breakthroughs-employee-experience",
    file: "breakthroughs-employee-experience.webp",
    buildSvg: () =>
      abstractSvg({
        bg: ["#2a0a18", "#5c1838"],
        shapes: `
          <rect x="-80" y="200" width="900" height="900" fill="#00d4ff" opacity="0.28" transform="rotate(-22 370 650)"/>
          <circle cx="1200" cy="350" r="280" fill="#ffd166" opacity="0.88"/>
          <circle cx="400" cy="780" r="200" fill="#00d4ff" opacity="0.7"/>
          <rect x="900" y="600" width="600" height="100" fill="#ffd166" opacity="0.25" transform="rotate(8 1200 650)"/>
        `,
        accent: "#00d4ff",
        label: "Employee Experience",
      }),
  },
  {
    slug: "human-potential-team-coach-certification",
    file: "human-potential-team-coach-certification.webp",
    buildSvg: () =>
      abstractSvg({
        bg: ["#0d1240", "#1a237e"],
        shapes: `
          <circle cx="400" cy="500" r="180" fill="#c6ff00" opacity="0.85"/>
          <circle cx="800" cy="500" r="180" fill="#e040fb" opacity="0.8"/>
          <circle cx="1200" cy="500" r="180" fill="#00e5ff" opacity="0.75"/>
          <rect x="80" y="120" width="1440" height="60" fill="#ffffff" opacity="0.1"/>
          <path d="M 100 900 Q 800 200 1500 900" fill="none" stroke="#e040fb" stroke-width="8" opacity="0.45"/>
        `,
        accent: "#c6ff00",
        label: "Team Coach Certification",
      }),
  },
];

function abstractSvg({ bg, shapes, accent, label, icfCceus }) {
  const badge = icfCceus
    ? `
    <rect x="56" y="56" width="380" height="96" rx="14" fill="${accent}"/>
    <text x="88" y="118" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="700" fill="#0a0f18">${icfCceus} ICF CCEUs</text>
  `
    : "";

  const subtitle = `
    <text x="56" y="${icfCceus ? 200 : 120}" font-family="Georgia, serif" font-size="52" font-weight="400" fill="#ffffff" opacity="0.92">${label}</text>
  `;

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg[0]}"/>
      <stop offset="100%" stop-color="${bg[1]}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  ${shapes}
  ${badge}
  ${subtitle}
</svg>`;
}

async function main() {
  for (const course of COURSES) {
    if (SKIP_FILES.has(course.file)) {
      console.log(`Skipped ${course.file} (custom artwork)`);
      continue;
    }

    const outPath = join(OUT_DIR, course.file);
    await sharp(Buffer.from(course.buildSvg()))
      .resize(WIDTH, HEIGHT)
      .webp({ quality: 84, effort: 6 })
      .toFile(outPath);

    console.log(
      `Generated ${course.file}${course.icfCceus ? ` (${course.icfCceus} ICF CCEUs badge)` : ""}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
