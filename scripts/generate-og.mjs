/**
 * Renders public/og-image.png — the 1200x630 card shown when the site is
 * shared to LinkedIn, X, WhatsApp, Slack or iMessage.
 *
 *   node scripts/generate-og.mjs
 *
 * Social scrapers do not render SVG, so this has to be a raster file.
 * The brand faces (Sora / Manrope / JetBrains Mono) are not installed on
 * the machine and librsvg silently falls back when a family is missing, so
 * every text run is converted to outlines with opentype.js first. Text as
 * paths renders identically everywhere and needs no fonts at render time.
 *
 * Fonts live in brand/fonts/ (fetched from Google Fonts, OFL).
 */
import sharp from "sharp";
import opentype from "opentype.js";
import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const W = 1200;
const H = 630;

const COTTON = "#EDEBDE";
const MID = "#a9a4b4";
const CRIMSON_LIFT = "#D94054";
const COSMIC = "#23212C";
const PANEL = "#1b1a23";

const load = (p) => opentype.parse(readFileSync(p).buffer);
const fonts = {
  display: load("brand/fonts/Sora-ExtraBold.ttf"),
  body: load("brand/fonts/Manrope-Medium.ttf"),
  mono: load("brand/fonts/JetBrainsMono-Regular.ttf"),
};

const r = (n) => Math.round(n * 100) / 100;

/**
 * Serialize path commands by hand.
 *
 * opentype.js's own toPathData() emits `NaN` for some quadratic control
 * points once the path is offset from the origin — the commands themselves
 * are clean, only its serializer is wrong. A renderer stops drawing at the
 * first NaN, which silently truncated words mid-glyph ("Muha…").
 */
function toPath(cmds) {
  const out = [];
  for (const c of cmds) {
    switch (c.type) {
      case "M":
        out.push(`M${r(c.x)} ${r(c.y)}`);
        break;
      case "L":
        out.push(`L${r(c.x)} ${r(c.y)}`);
        break;
      case "C":
        out.push(`C${r(c.x1)} ${r(c.y1)} ${r(c.x2)} ${r(c.y2)} ${r(c.x)} ${r(c.y)}`);
        break;
      case "Q":
        out.push(`Q${r(c.x1)} ${r(c.y1)} ${r(c.x)} ${r(c.y)}`);
        break;
      case "Z":
        out.push("Z");
        break;
    }
  }
  const d = out.join("");
  if (d.includes("NaN"))
    throw new Error("NaN in path data — refusing to write a truncated glyph run");
  return d;
}

/** Text -> <path>, so the render never depends on an installed family. */
function text(str, { font, size, x, y, fill, tracking = 0 }) {
  const f = fonts[font];
  if (!tracking) {
    return `<path d="${toPath(f.getPath(str, x, y, size).commands)}" fill="${fill}"/>`;
  }
  // opentype has no letter-spacing, so place glyphs one at a time.
  let cursor = x;
  const parts = [];
  for (const ch of str) {
    parts.push(toPath(f.getPath(ch, cursor, y, size).commands));
    cursor += (f.charToGlyph(ch).advanceWidth / f.unitsPerEm) * size + tracking;
  }
  return `<path d="${parts.join(" ")}" fill="${fill}"/>`;
}

function measure(str, { font, size, tracking = 0 }) {
  const f = fonts[font];
  let w = 0;
  for (const ch of str) w += (f.charToGlyph(ch).advanceWidth / f.unitsPerEm) * size + tracking;
  return w - tracking;
}

const MARK_S = "M69 33 C69 21 31 21 31 36 C31 49 69 51 69 65 C69 80 31 80 31 68";

function svg() {
  const eyebrow = "SHAYXO.DEV";
  const tail = ["ANDROID", "DESKTOP", "WEB", "iOS"];

  // right-aligned footer rail
  let railX = W - 72;
  const railParts = [];
  for (const t of [...tail].reverse()) {
    const w = measure(t, { font: "mono", size: 13.5, tracking: 0.95 });
    railX -= w;
    railParts.push(
      text(t, {
        font: "mono",
        size: 13.5,
        x: railX,
        y: 580,
        fill: "rgba(237,235,222,0.5)",
        tracking: 0.95,
      }),
    );
    railX -= 20;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="mk" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(50 0.5 0.5)">
      <stop offset="0" stop-color="${COTTON}"/><stop offset="1" stop-color="${CRIMSON_LIFT}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${CRIMSON_LIFT}" stop-opacity="0.16"/>
      <stop offset="0.68" stop-color="${CRIMSON_LIFT}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="${COTTON}" stroke-opacity="0.028" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${COSMIC}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="1170" cy="430" r="310" fill="url(#bloom)"/>

  <!-- layered planes, echoing the spatial stack on the site -->
  <g transform="translate(864 168) rotate(-9 125 125)">
    <rect width="250" height="250" rx="30" fill="#35304a" fill-opacity="0.42" stroke="${COTTON}" stroke-opacity="0.08"/>
  </g>
  <g transform="translate(822 208) rotate(-3 125 125)">
    <rect width="250" height="250" rx="30" fill="${PANEL}" fill-opacity="0.82" stroke="${COTTON}" stroke-opacity="0.12"/>
  </g>
  <g transform="translate(780 250)">
    <rect width="250" height="250" rx="30" fill="${PANEL}" stroke="${CRIMSON_LIFT}" stroke-opacity="0.30"/>
    <g transform="translate(66 66) scale(1.18)">
      <rect width="100" height="100" rx="24" fill="url(#mk)"/>
      <path d="${MARK_S}" fill="none" stroke="${COSMIC}" stroke-width="11.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- eyebrow -->
  <circle cx="75.5" cy="115" r="3.5" fill="${CRIMSON_LIFT}" fill-opacity="0.95"/>
  <circle cx="75.5" cy="115" r="7.5" fill="${CRIMSON_LIFT}" fill-opacity="0.14"/>
  ${text(eyebrow, { font: "mono", size: 15, x: 92, y: 121, fill: "rgba(237,235,222,0.62)", tracking: 1.5 })}

  <!-- name -->
  ${text("Muhammad", { font: "display", size: 82, x: 70, y: 232, fill: COTTON })}
  ${text("Shayan.", { font: "display", size: 82, x: 70, y: 316, fill: MID })}

  <rect x="72" y="356" width="74" height="3" rx="1.5" fill="${CRIMSON_LIFT}"/>

  <!-- role -->
  ${text("Kotlin Multiplatform Developer", { font: "body", size: 28, x: 71, y: 418, fill: "rgba(237,235,222,0.88)" })}

  <!-- footer rail -->
  <rect x="72" y="575.5" width="${railX - 72 - 2}" height="1" fill="${COTTON}" fill-opacity="0.12"/>
  ${railParts.join("\n  ")}
</svg>`;
}

const out = "public/og-image.png";
const buf = await sharp(Buffer.from(svg())).png({ compressionLevel: 9 }).toBuffer();
await writeFile(out, buf);
const meta = await sharp(buf).metadata();
console.log(`wrote ${out} — ${meta.width}x${meta.height}, ${(buf.length / 1024).toFixed(0)} KB`);
