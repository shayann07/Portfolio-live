/**
 * The Wexpa logo as a reusable mask, shared by the icon and social-image generators.
 *
 * Source: brand/logo/wexpa-logo.png, a one-colour mark on an opaque white
 * canvas. The mark is recovered as a clean alpha mask (the white is removed,
 * not painted over), cropped to its own bounds and re-rendered at any size.
 * Upscaled edges are re-sharpened so large renders stay crisp.
 */
import sharp from "sharp";

export const SOURCE = "brand/logo/wexpa-logo.png";

export const COTTON = "#EDEBDE";
export const COSMIC = "#23212C";
export const MARK = [0x75, 0x1b, 0x20]; // the logo's own red
export const MARK_ON_DARK = [0xe2, 0x6b, 0x76]; // same hue, lifted so it reads on a dark surface

export const hex = ([r, g, b]) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
export const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const solid = (h) => {
  const [r, g, b] = hexToRgb(h);
  return { r, g, b, alpha: 1 };
};

/** The logo as a tightly cropped 8-bit alpha mask (255 = ink). */
export async function loadMask() {
  const { data, info } = await sharp(SOURCE)
    .flatten({ background: "#ffffff" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  // The ink is one colour on white, so green carries the whole signal.
  const inkG = MARK[1];
  const alpha = Buffer.alloc(width * height);
  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const g = data[(y * width + x) * channels + 1];
      const a = Math.max(0, Math.min(255, Math.round(((255 - g) / (255 - inkG)) * 255)));
      alpha[y * width + x] = a;
      if (a > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const crop = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  return sharp(alpha, { raw: { width, height, channels: 1 } })
    .extract(crop)
    .png()
    .toBuffer();
}

/**
 * Renders the mark into a size x size canvas.
 * @param {Buffer} mask    cropped alpha mask
 * @param {number} size    output edge in px
 * @param {number} pad     empty margin as a fraction of the canvas, per side
 * @param {number[]} color mark colour
 * @param {object|null} ground  solid background, or null for transparent
 */
export async function render(mask, size, { pad = 0.1, color = MARK, ground = null } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const { data, info } = await sharp(mask)
    .resize(inner, inner, { fit: "inside", kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Re-sharpen: stretch the soft ramp of an upscaled edge back to a thin one.
  const gain = size > 96 ? 3 : 1;
  const px = info.width * info.height;
  const rgba = Buffer.alloc(px * 4);
  for (let i = 0; i < px; i++) {
    const a = Math.max(0, Math.min(255, Math.round((data[i * info.channels] - 128) * gain + 128)));
    rgba[i * 4] = color[0];
    rgba[i * 4 + 1] = color[1];
    rgba[i * 4 + 2] = color[2];
    rgba[i * 4 + 3] = a;
  }
  const glyph = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: ground ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: glyph, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
