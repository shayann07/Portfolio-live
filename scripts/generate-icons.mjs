/**
 * Generates every logo-derived asset from the Wexpa logo (scripts/lib/logo.mjs).
 *
 *   node scripts/generate-icons.mjs
 *
 * Browser-tab icons are transparent. Two things cannot be: the iOS home-screen
 * icon (iOS fills transparency with black) and the maskable PWA icon (the OS
 * crops it to a shape), so those sit on the cotton ground from src/styles.css.
 * The tab icon also has a dark-scheme twin in a lighter tint of the same mark,
 * because the logo's deep red disappears on a dark browser tab.
 *
 * The 1200x630 social card is a separate script: scripts/generate-og.mjs.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { COTTON, COSMIC, MARK, MARK_ON_DARK, hex, solid, loadMask, render } from "./lib/logo.mjs";

const OUT = "public";

/**
 * ICO container holding PNG payloads (every browser that still asks for
 * favicon.ico understands PNG-in-ICO, so there is no need for a BMP encoder).
 */
function icoFromPngs(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length + 16 * images.length;
  const dirs = [];
  for (const { png, size } of images) {
    const dir = Buffer.alloc(16);
    dir.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    dir.writeUInt8(size >= 256 ? 0 : size, 1); // height
    dir.writeUInt8(0, 2); // palette
    dir.writeUInt8(0, 3); // reserved
    dir.writeUInt16LE(1, 4); // colour planes
    dir.writeUInt16LE(32, 6); // bits per pixel
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += png.length;
    dirs.push(dir);
  }
  return Buffer.concat([header, ...dirs, ...images.map((i) => i.png)]);
}

const manifest = {
  name: "Muhammad Shayan",
  short_name: "Shayan",
  description: "Kotlin Multiplatform developer shipping apps for Android, iOS, desktop and web.",
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
  const written = [];
  const w = async (name, buf) => {
    await writeFile(join(OUT, name), buf);
    written.push(name);
  };
  const mask = await loadMask();
  const tab = (size, color = MARK) => render(mask, size, { pad: 0.04, color });

  // Browser tab: transparent, with a lighter twin for dark tabs.
  await w("favicon-32.png", await tab(32));
  await w("favicon-32-dark.png", await tab(32, MARK_ON_DARK));
  // Google Search asks for a multiple of 48px.
  await w("favicon-48.png", await tab(48));
  await w(
    "favicon.ico",
    icoFromPngs(
      await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await tab(size) }))),
    ),
  );

  // iOS home screen: square source, iOS applies its own corner mask and fills
  // transparency with black, so this one needs the cotton ground.
  await w("apple-touch-icon.png", await render(mask, 180, { pad: 0.26, ground: solid(COTTON) }));

  // Android / PWA.
  await w("icon-192.png", await render(mask, 192, { pad: 0.12 }));
  await w("icon-512.png", await render(mask, 512, { pad: 0.12 }));
  await w("icon-512-maskable.png", await render(mask, 512, { pad: 0.3, ground: solid(COTTON) }));

  // The bare logo, transparent, for anywhere a logo is wanted: one for light
  // backgrounds (the original red) and one for dark ones (the lifted tint).
  await w("logo.png", await render(mask, 512, { pad: 0.04 }));
  await w("logo-on-dark.png", await render(mask, 512, { pad: 0.04, color: MARK_ON_DARK }));

  await w("site.webmanifest", JSON.stringify(manifest, null, 2) + "\n");

  console.log("wrote:\n  " + [...new Set(written)].join("\n  "));
  console.log(`mark ${hex(MARK)}, dark-surface tint ${hex(MARK_ON_DARK)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
