/**
 * Generates the favicon / app-icon set from one vector source.
 *
 *   node scripts/generate-icons.mjs
 *
 * The mark is the site's `.mark` monogram redrawn as geometry: a rounded
 * square filled with the cotton -> crimson-lift gradient, with a geometric
 * "S" knocked out in cosmic. Palette is lifted from src/styles.css.
 *
 * Below 32px the stroke thickens so the S's counters do not fill in.
 */
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const OUT = "public";

const COTTON = "#EDEBDE";
const CRIMSON_LIFT = "#D94054";
const COSMIC = "#23212C";

/**
 * @param {object} o
 * @param {number} o.stroke   S stroke width in the 100-unit grid
 * @param {number} o.radius   corner radius in the 100-unit grid (max 50 = circle)
 * @param {boolean} o.bleed   true = ground fills the whole canvas (maskable / apple-touch)
 */
function markSvg({ stroke = 11.5, radius = 24, bleed = false } = {}) {
  const ground = bleed
    ? `<rect width="100" height="100" fill="url(#g)"/>`
    : `<rect width="100" height="100" rx="${radius}" fill="url(#g)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(50 0.5 0.5)">
      <stop offset="0" stop-color="${COTTON}"/>
      <stop offset="1" stop-color="${CRIMSON_LIFT}"/>
    </linearGradient>
  </defs>
  ${ground}
  <path d="M69 33 C69 21 31 21 31 36 C31 49 69 51 69 65 C69 80 31 80 31 68"
        fill="none" stroke="${COSMIC}" stroke-width="${stroke}" stroke-linecap="round"/>
</svg>`;
}

const png = (svg, size) =>
  sharp(Buffer.from(svg))
    .resize(size, size, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Minimal ICO container wrapping a PNG. Every browser that still asks for
 * favicon.ico understands PNG-in-ICO, so there is no need for a BMP encoder.
 */
function icoFromPng(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const dir = Buffer.alloc(16);
  dir.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
  dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
  dir.writeUInt8(0, 2); // palette
  dir.writeUInt8(0, 3); // reserved
  dir.writeUInt16LE(1, 4); // colour planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32LE(pngBuf.length, 8);
  dir.writeUInt32LE(header.length + dir.length, 12); // offset to payload
  return Buffer.concat([header, dir, pngBuf]);
}

const manifest = {
  name: "Muhammad Shayan",
  short_name: "Shayan",
  description: "Software engineer — Kotlin Multiplatform, backend services, and on-device ML.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  background_color: COSMIC,
  theme_color: COSMIC,
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ],
};

async function main() {
  await mkdir(OUT, { recursive: true });
  const w = (name, buf) => writeFile(join(OUT, name), buf);

  // Vector favicon — what modern browsers actually prefer.
  await w("favicon.svg", markSvg({ stroke: 12.5 }));

  // Legacy .ico, drawn from the thick-stroke variant so it survives 32px.
  await w("favicon.ico", icoFromPng(await png(markSvg({ stroke: 13 }), 32), 32));

  // iOS home screen: square source, iOS applies its own corner mask.
  await w("apple-touch-icon.png", await png(markSvg({ bleed: true }), 180));

  // Android / PWA.
  await w("icon-192.png", await png(markSvg({ radius: 24 }), 192));
  await w("icon-512.png", await png(markSvg({ radius: 24 }), 512));
  await w("icon-512-maskable.png", await png(markSvg({ bleed: true }), 512));

  await w("site.webmanifest", JSON.stringify(manifest, null, 2) + "\n");

  console.log("wrote:");
  for (const f of [
    "favicon.svg",
    "favicon.ico",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "icon-512-maskable.png",
    "site.webmanifest",
  ]) {
    console.log("  " + f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
