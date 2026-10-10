import { describe, expect, it } from "vitest";
import { BEAT, ICON_MOTION, ICON_NAMES, ORBIT_GEOMETRY, iconMotion } from "./iconMotion";

const animatedNames = Object.keys(ICON_MOTION);

describe("icon motion specs", () => {
  it("only specs glyphs that AnimatedIcon can render", () => {
    for (const name of animatedNames) expect(ICON_NAMES).toContain(name as never);
  });

  it("uses positive, finite durations everywhere", () => {
    for (const [name, parts] of Object.entries(ICON_MOTION))
      for (const [part, spec] of Object.entries(parts)) {
        expect(spec.duration, `${name}.${part}`).toBeGreaterThan(0);
        expect(Number.isFinite(spec.duration), `${name}.${part}`).toBe(true);
      }
  });

  it("keeps the shared 2.4s beat for pulse-style glyphs", () => {
    expect(ICON_MOTION.arrow.body.duration).toBe(BEAT);
    expect(ICON_MOTION.chip.core.duration).toBe(BEAT);
    expect(ICON_MOTION.mail.flap.duration).toBe(BEAT);
    expect(ICON_MOTION.map.pin.duration).toBe(BEAT);
  });

  it("staggers the layer glyph in ascending delay order", () => {
    const { top, mid, bottom } = ICON_MOTION.layers;
    expect(top.delay ?? 0).toBeLessThan(mid.delay!);
    expect(mid.delay!).toBeLessThan(bottom.delay!);
  });
});

describe("rotation direction", () => {
  const endOf = (v: number | number[]) => (Array.isArray(v) ? v[v.length - 1] : v);

  it("spins the orbit outer ring clockwise and the inner ring counter-clockwise", () => {
    const outer = ICON_MOTION.orbit.outer;
    const inner = ICON_MOTION.orbit.inner;
    expect(outer.direction).toBe("cw");
    expect(inner.direction).toBe("ccw");
    expect(endOf(outer.active.rotate!)).toBeGreaterThan(outer.rest.rotate);
    expect(endOf(inner.active.rotate!)).toBeLessThan(inner.rest.rotate);
  });

  it("rotates the gear clockwise at a slow linear cadence", () => {
    expect(ICON_MOTION.gear.body.direction).toBe("cw");
    expect(ICON_MOTION.gear.body.ease).toBe("linear");
    expect(ICON_MOTION.gear.body.duration).toBe(18);
  });

  it("declares a direction for every rotating part only", () => {
    for (const parts of Object.values(ICON_MOTION))
      for (const spec of Object.values(parts)) {
        const rotates = "rotate" in spec.rest || "rotate" in spec.active;
        expect(Boolean(spec.direction)).toBe(rotates);
      }
  });
});

describe("satellite path", () => {
  it("keeps the satellite exactly on the outer ring", () => {
    const { center, outerRing, satellite } = ORBIT_GEOMETRY;
    const nx = (satellite.cx - center.x) / outerRing.rx;
    const ny = (satellite.cy - center.y) / outerRing.ry;
    expect(nx * nx + ny * ny).toBeCloseTo(1, 5);
  });

  it("keeps the satellite inside the 24x24 viewbox", () => {
    const { satellite } = ORBIT_GEOMETRY;
    expect(satellite.cx + satellite.r).toBeLessThanOrEqual(24);
    expect(satellite.cy + satellite.r).toBeLessThanOrEqual(24);
    expect(satellite.cx - satellite.r).toBeGreaterThanOrEqual(0);
  });

  it("orbits slower on the inner ring than the outer ring", () => {
    expect(ICON_MOTION.orbit.inner.duration).toBeGreaterThan(ICON_MOTION.orbit.outer.duration);
  });
});

describe("reduced motion resolution", () => {
  it("returns the static rest state with no repeat for every animated part", () => {
    for (const [name, parts] of Object.entries(ICON_MOTION))
      for (const [part, spec] of Object.entries(parts)) {
        const res = iconMotion(name, part, true);
        expect(res.animate, `${name}.${part}`).toEqual(spec.rest);
        expect((res.transition as { repeat?: number }).repeat).toBeUndefined();
        expect((res.transition as { duration: number }).duration).toBe(0);
        for (const value of Object.values(res.animate as Record<string, unknown>))
          expect(Array.isArray(value), `${name}.${part} must be static`).toBe(false);
      }
  });

  it("loops infinitely when motion is allowed", () => {
    for (const [name, parts] of Object.entries(ICON_MOTION))
      for (const part of Object.keys(parts)) {
        const res = iconMotion(name, part, false);
        expect((res.transition as { repeat: number }).repeat, `${name}.${part}`).toBe(Infinity);
      }
  });

  it("returns no props for unknown glyphs", () => {
    expect(iconMotion("github", "body", false).animate).toBeUndefined();
    expect(iconMotion("nope", "body", true).transition).toBeUndefined();
  });
});
