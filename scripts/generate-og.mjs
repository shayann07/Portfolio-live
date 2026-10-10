/**
 * Renders public/og-image.png: the 1200x630 card shown when the site is
 * shared to LinkedIn, X, WhatsApp, Slack or iMessage.
 *
 *   node scripts/generate-og.mjs
 *
 * The card is the LinkedIn banner in a different frame: a warm near-black
 * ground with an amber glow rising from the lower left, a short amber bar, the
 * role as a heavy two-line headline, and the name as the quiet line beneath.
 * Colours are read off the banner itself (linkedin-banner-dark.png).
 *
 * Social scrapers do not render SVG, so this has to be a raster file, and the
 * brand faces are not installed on the machine, so every text run is converted
 * to outlines with opentype.js first. Text as paths renders identically
 * everywhere and needs no fonts at render time.
 *
 * Fonts live in brand/fonts/ (fetched from Google Fonts, OFL).
 */
import sharp from "sharp";
import opentype from "opentype.js";
import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";

const W = 1200;
const H = 630;

// the banner's own palette
const GROUND = "#0b0907";
const AMBER = "#e0954a";
const GLOW = "#3f2511";
const EDGE = "#20140b";
const HEADLINE = "#f5f1ec";
const SUB = "#b5ada3";

const load = (p) => opentype.parse(readFileSync(p).buffer);
const fonts = {
  display: load("brand/fonts/Sora-ExtraBold.ttf"),
  body: load("brand/fonts/Manrope-Medium.ttf"),
};

const r = (n) => Math.round(n * 100) / 100;

/**
 * Serialize path commands by hand.
 *
 * opentype.js's own toPathData() emits `NaN` for some quadratic control
 * points once the path is offset from the origin; the commands themselves
 * are clean, only its serializer is wrong. A renderer stops drawing at the
 * first NaN, which silently truncated words mid-glyph.
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
    throw new Error("NaN in path data: refusing to write a truncated glyph run");
  return d;
}

function measure(str, { font, size, tracking = 0 }) {
  const f = fonts[font];
  let w = 0;
  for (const ch of str) w += (f.charToGlyph(ch).advanceWidth / f.unitsPerEm) * size + tracking;
  return w - tracking;
}

/** Text -> <path>. `anchor` is "start" (x is the left edge) or "middle" (x is the centre). */
function text(str, { font, size, x, y, fill, tracking = 0, anchor = "start", opacity = 1 }) {
  const f = fonts[font];
  let cursor = anchor === "middle" ? x - measure(str, { font, size, tracking }) / 2 : x;
  const parts = [];
  for (const ch of str) {
    parts.push(toPath(f.getPath(ch, cursor, y, size).commands));
    cursor += (f.charToGlyph(ch).advanceWidth / f.unitsPerEm) * size + tracking;
  }
  return `<path d="${parts.join(" ")}" fill="${fill}" fill-opacity="${opacity}"/>`;
}

// ---- layout -----------------------------------------------------------
const LEFT = 110;
const MAX_W = W - LEFT * 2;

/** Largest size at which the line still fits the card. */
function fit(str, font, cap, tracking) {
  let size = cap;
  while (measure(str, { font, size, tracking: tracking * size }) > MAX_W && size > 20) size -= 1;
  return size;
}

function svg() {
  const lines = ["Kotlin Multiplatform", "Developer"];
  const size = Math.min(...lines.map((l) => fit(l, "display", 96, -0.02)));
  const lineGap = size * 1.08;
  const block = 5 + 38 + size + lineGap + 44 + 34; // bar + gap + 2 headline lines + gap + subline
  const top = (H - block) / 2;
  const barY = top;
  const y1 = barY + 5 + 38 + size * 0.78;
  const y2 = y1 + lineGap;
  const ySub = y2 + 62;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="160" cy="540" r="560" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${GLOW}" stop-opacity="1"/>
      <stop offset="0.55" stop-color="${GLOW}" stop-opacity="0.32"/>
      <stop offset="1" stop-color="${GLOW}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="edge" cx="${W}" cy="${H * 0.5}" r="420" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${EDGE}" stop-opacity="1"/>
      <stop offset="1" stop-color="${EDGE}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${GROUND}"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#edge)"/>
  <rect x="${LEFT}" y="${r(barY)}" width="72" height="5" rx="1" fill="${AMBER}"/>
  ${text(lines[0], { font: "display", size, x: LEFT, y: y1, fill: HEADLINE, tracking: -0.02 * size })}
  ${text(lines[1], { font: "display", size, x: LEFT, y: y2, fill: HEADLINE, tracking: -0.02 * size })}
  ${text("Muhammad Shayan", { font: "body", size: 34, x: LEFT + 2, y: ySub, fill: SUB, tracking: 0.4 })}
</svg>`;
}

const out = "public/og-image.png";
const buf = await sharp(Buffer.from(svg())).png({ compressionLevel: 9 }).toBuffer();
await writeFile(out, buf);
const meta = await sharp(buf).metadata();
console.log(`wrote ${out}: ${meta.width}x${meta.height}, ${(buf.length / 1024).toFixed(0)} KB`);
