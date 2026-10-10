#!/usr/bin/env python3
"""Visual regression across key scroll positions.

Guards palette, shader grading and CTA legibility. Captures the viewport at
each anchor section (mobile / desktop, reduced-motion + animation frozen so
shots are deterministic) and pixel-diffs against committed baselines.

Usage:
  python3 scripts/visual-scroll-check.py            # verify
  python3 scripts/visual-scroll-check.py --update   # rewrite baselines
  BASE_URL=http://localhost:8080 python3 scripts/visual-scroll-check.py
"""
import argparse, asyncio, os, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BASELINE_DIR = ROOT / "tests" / "scroll-baselines"
OUT_DIR = Path(os.environ.get("VISUAL_OUT", "/tmp/browser/scroll"))
CURRENT_DIR, DIFF_DIR = OUT_DIR / "current", OUT_DIR / "diff"
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")

BREAKPOINTS = [("mobile", 390, 844), ("desktop", 1440, 900)]
STOPS = ["#top", "#about", "#work", "#lab", "#contact"]
DIFF_TOLERANCE = 0.004  # 0.4% of pixels

FREEZE_CSS = """
*, *::before, *::after {
  animation-play-state: paused !important;
  animation-delay: -1ms !important;
  animation-duration: 1ms !important;
  transition: none !important;
}
.reveal { opacity: 1 !important; transform: none !important; }
"""

failures: list[str] = []
notes: list[str] = []


def diff_ratio(a: Path, b: Path, out: Path) -> float:
    ia, ib = Image.open(a).convert("RGB"), Image.open(b).convert("RGB")
    if ia.size != ib.size:
        return 1.0
    delta = ImageChops.difference(ia, ib)
    changed = int((np.asarray(delta, dtype=np.int16).max(axis=2) > 12).sum())
    ratio = changed / (ia.size[0] * ia.size[1])
    if ratio > 0:
        out.parent.mkdir(parents=True, exist_ok=True)
        delta.save(out)
    return ratio


CTA_JS = """
() => {
  const parse = s => (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number);
  const lum = ([r, g, b]) => {
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  return [...document.querySelectorAll('.btn')].map(el => {
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    let bg = null, e = el;
    while (e && !bg) {
      const c = getComputedStyle(e).backgroundColor;
      const a = c.startsWith('rgba') ? parseFloat(c.split(',')[3]) : 1;
      if (a > 0.85) bg = parse(c);
      e = e.parentElement;
    }
    if (!bg || fg.length < 3) return null;
    const [L1, L2] = [lum(fg), lum(bg)];
    const r = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    return { label: el.textContent.trim().slice(0, 24), ratio: +r.toFixed(2) };
  }).filter(Boolean);
}
"""


async def run(pw, update: bool):
    browser = await pw.chromium.launch(headless=True)
    for bp, w, h in BREAKPOINTS:
        ctx = await browser.new_context(viewport={"width": w, "height": h},
                                        device_scale_factor=1, reduced_motion="reduce")
        page = await ctx.new_page()
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))

        await page.goto(BASE_URL + "/", wait_until="networkidle")
        await page.add_style_tag(content=FREEZE_CSS)
        await page.wait_for_timeout(500)

        for cta in await page.evaluate(CTA_JS):
            if cta["ratio"] < 4.5:
                failures.append(f"{bp}: CTA '{cta['label']}' contrast {cta['ratio']}:1 < 4.5:1")
            notes.append(f"{bp:8} CTA {cta['label'][:22]:24} {cta['ratio']}:1")

        for stop in STOPS:
            el = await page.query_selector(stop)
            if el is None:
                failures.append(f"{bp}: missing section {stop}")
                continue
            await page.evaluate("s => document.querySelector(s).scrollIntoView()", stop)
            await page.wait_for_timeout(500)
            key = f"{stop.lstrip('#')}_{bp}.png"
            shot = CURRENT_DIR / key
            shot.parent.mkdir(parents=True, exist_ok=True)
            await page.screenshot(path=str(shot), animations="disabled")

            baseline = BASELINE_DIR / key
            if update or not baseline.exists():
                baseline.parent.mkdir(parents=True, exist_ok=True)
                baseline.write_bytes(shot.read_bytes())
                notes.append(f"  baseline {'updated' if update else 'created'}: {key}")
                continue
            ratio = diff_ratio(baseline, shot, DIFF_DIR / key)
            notes.append(f"{bp:8} {key:22} diff={ratio:.3%}")
            if ratio > DIFF_TOLERANCE:
                failures.append(f"{key}: differs from baseline ({ratio:.2%} of pixels)")

        if errors:
            failures.append(f"{bp}: console errors -> {errors[:3]}")
        await ctx.close()
    await browser.close()


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true")
    args = ap.parse_args()
    async with async_playwright() as pw:
        await run(pw, args.update)
    print("\n".join(notes))
    if failures:
        print("\nFAILURES:")
        for f in failures:
            print(" -", f)
        print(f"\nDiff images: {DIFF_DIR}")
        return 1
    print("\nAll scroll-position visual checks passed.")
    return 0


sys.exit(asyncio.run(main()))
