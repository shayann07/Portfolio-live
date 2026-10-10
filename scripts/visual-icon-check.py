#!/usr/bin/env python3
"""Visual regression check for AnimatedIcon across every portfolio section.

Captures every section (and the /icons gallery) at mobile / tablet / desktop in
both normal and reduced-motion modes, asserts icon box geometry + console
cleanliness, and pixel-diffs the deterministic (reduced-motion, animation
frozen) shots against committed baselines.

Usage:
  python3 scripts/visual-icon-check.py              # verify against baselines
  python3 scripts/visual-icon-check.py --update     # (re)write baselines
  BASE_URL=http://localhost:8080 python3 scripts/visual-icon-check.py
"""
import argparse
import asyncio
import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BASELINE_DIR = ROOT / "tests" / "visual-baselines"
OUT_DIR = Path(os.environ.get("VISUAL_OUT", "/tmp/browser/icons"))
CURRENT_DIR = OUT_DIR / "current"
DIFF_DIR = OUT_DIR / "diff"
BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")

BREAKPOINTS = [("mobile", 390), ("tablet", 768), ("desktop", 1440)]
SECTIONS = ["#top", "#about", "#work", "#lab", "#contact"]
GALLERY_PATH = "/icons"
# Allow a tiny amount of noise (font AA, subpixel layout) before failing.
DIFF_TOLERANCE = 0.002  # 0.2% of pixels

FREEZE_CSS = """
*, *::before, *::after {
  animation-play-state: paused !important;
  animation-delay: -1ms !important;
  animation-duration: 1ms !important;
  transition: none !important;
}
canvas { visibility: hidden !important; }
"""

failures: list[str] = []
notes: list[str] = []


def diff_ratio(a: Path, b: Path, out: Path) -> float:
    ia = Image.open(a).convert("RGB")
    ib = Image.open(b).convert("RGB")
    if ia.size != ib.size:
        return 1.0
    delta = ImageChops.difference(ia, ib)
    arr = np.asarray(delta, dtype=np.int16)
    changed = int((arr.max(axis=2) > 12).sum())
    ratio = changed / (ia.size[0] * ia.size[1])
    if ratio > 0:
        out.parent.mkdir(parents=True, exist_ok=True)
        delta.save(out)
    return ratio


async def audit_page(page, label: str, motion: str, bp: str, freeze: bool, update: bool):
    """Screenshot every section on the current page and validate icon geometry."""
    icons = await page.eval_on_selector_all(
        "[data-icon]",
        """els => els.map(e => {
             const r = e.getBoundingClientRect();
             return { name: e.getAttribute('data-icon'),
                      w: Math.round(r.width), h: Math.round(r.height) };
           })""",
    )
    if not icons:
        failures.append(f"{label}/{bp}/{motion}: no icons rendered")
    for ic in icons:
        if ic["w"] != ic["h"]:
            failures.append(f"{label}/{bp}/{motion}: icon '{ic['name']}' not square ({ic['w']}x{ic['h']})")
        if ic["w"] < 12 or ic["w"] > 64:
            failures.append(f"{label}/{bp}/{motion}: icon '{ic['name']}' size out of range ({ic['w']}px)")
    notes.append(f"{label:8} {bp:8} {motion:8} icons={len(icons)}")

    targets = SECTIONS if label == "home" else ["main"]
    for sel in targets:
        el = await page.query_selector(sel)
        if el is None:
            failures.append(f"{label}/{bp}: missing selector {sel}")
            continue
        await el.scroll_into_view_if_needed()
        await page.wait_for_timeout(350)
        key = f"{label}_{sel.lstrip('#')}_{bp}_{motion}.png"
        shot = CURRENT_DIR / key
        shot.parent.mkdir(parents=True, exist_ok=True)
        await el.screenshot(path=str(shot), animations="disabled")

        if not freeze:
            continue  # only the frozen pass is deterministic enough to diff
        baseline = BASELINE_DIR / key
        if update or not baseline.exists():
            baseline.parent.mkdir(parents=True, exist_ok=True)
            baseline.write_bytes(shot.read_bytes())
            notes.append(f"  baseline {'updated' if update else 'created'}: {key}")
            continue
        ratio = diff_ratio(baseline, shot, DIFF_DIR / key)
        if ratio > DIFF_TOLERANCE:
            failures.append(f"{key}: screenshot differs from baseline ({ratio:.2%} of pixels)")


async def run(pw, motion: str, update: bool):
    freeze = motion == "reduced"
    browser = await pw.chromium.launch(headless=True)
    for bp, width in BREAKPOINTS:
        ctx = await browser.new_context(
            viewport={"width": width, "height": 1400},
            device_scale_factor=1,
            reduced_motion="reduce" if motion == "reduced" else "no-preference",
        )
        page = await ctx.new_page()
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))

        for label, path in (("home", "/"), ("gallery", GALLERY_PATH)):
            await page.goto(BASE_URL + path, wait_until="networkidle")
            if freeze:
                await page.add_style_tag(content=FREEZE_CSS)
            if label == "gallery" and freeze:
                await page.click("[data-testid='reduced-motion-toggle']")
                await page.wait_for_timeout(200)
            await page.wait_for_timeout(400)
            await audit_page(page, label, motion, bp, freeze, update)

        if errors:
            failures.append(f"{bp}/{motion}: console errors -> {errors[:3]}")
        await ctx.close()
    await browser.close()


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--update", action="store_true", help="write baselines instead of comparing")
    args = ap.parse_args()

    async with async_playwright() as pw:
        for motion in ("normal", "reduced"):
            await run(pw, motion, args.update)

    print("\n".join(notes))
    if failures:
        print("\nFAILURES:")
        for f in failures:
            print(" -", f)
        print(f"\nDiff images: {DIFF_DIR}")
        return 1
    print("\nAll icon visual checks passed.")
    return 0


sys.exit(asyncio.run(main()))
