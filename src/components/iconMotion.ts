/**
 * Single source of truth for AnimatedIcon motion.
 * Both the component and the tests read these specs, so timing, rotation
 * direction and satellite geometry can be verified without a browser.
 */

export const BEAT = 2.4;

export type MotionValues = Record<string, number | number[]>;

export type IconMotionPart = {
  /** Seconds for one full cycle. */
  duration: number;
  ease: "linear" | "easeInOut";
  /** Resting (reduced-motion / static) state. */
  rest: Record<string, number>;
  /** Animated keyframes. */
  active: MotionValues;
  /** Rotation direction, when the part rotates. */
  direction?: "cw" | "ccw";
  delay?: number;
};

const beat = (rest: Record<string, number>, active: MotionValues, delay = 0): IconMotionPart => ({
  duration: BEAT,
  ease: "easeInOut",
  rest,
  active,
  delay,
});

/** Geometry of the orbit glyph; the satellite must sit exactly on the ring. */
export const ORBIT_GEOMETRY = {
  center: { x: 12, y: 12 },
  outerRing: { rx: 9, ry: 4.2 },
  innerRing: { rx: 6, ry: 9 },
  satellite: { cx: 21, cy: 12, r: 1.5 },
} as const;

export const ICON_MOTION: Record<string, Record<string, IconMotionPart>> = {
  arrow: { body: beat({ x: 0 }, { x: [0, 2, 0] }) },
  spark: {
    cross: beat({ opacity: 1 }, { opacity: [0.45, 1, 0.45] }),
    diagonals: beat({ opacity: 0.55 }, { opacity: [0.25, 0.7, 0.25] }, BEAT / 2),
  },
  gear: {
    body: {
      duration: 18,
      ease: "linear",
      direction: "cw",
      rest: { rotate: 0 },
      active: { rotate: 360 },
    },
  },
  bolt: { body: beat({ scale: 1 }, { scale: [0.96, 1.04, 0.96] }) },
  orbit: {
    outer: {
      duration: 9,
      ease: "linear",
      direction: "cw",
      rest: { rotate: 0 },
      active: { rotate: 360 },
    },
    inner: {
      duration: 14,
      ease: "linear",
      direction: "ccw",
      rest: { rotate: 60 },
      active: { rotate: [60, -300] },
    },
  },
  download: { arrowhead: beat({ y: 0 }, { y: [0, 2, 0] }) },
  map: { pin: beat({ scale: 1, opacity: 1 }, { scale: [0.8, 1.15, 0.8], opacity: [0.6, 1, 0.6] }) },
  layers: {
    top: { duration: 3, ease: "easeInOut", rest: { y: 0 }, active: { y: [0, -1.2, 0] } },
    mid: { duration: 3, ease: "easeInOut", rest: { y: 0 }, active: { y: [0, 1, 0] }, delay: 0.15 },
    bottom: {
      duration: 3,
      ease: "easeInOut",
      rest: { y: 0 },
      active: { y: [0, 1.6, 0] },
      delay: 0.3,
    },
  },
  wave: {
    front: { duration: 3.2, ease: "easeInOut", rest: { x: 0 }, active: { x: [0, -5, 0] } },
    back: { duration: 3.8, ease: "easeInOut", rest: { x: 0 }, active: { x: [0, 5, 0] } },
  },
  chip: { core: beat({ opacity: 1 }, { opacity: [0.35, 1, 0.35] }) },
  mail: { flap: beat({ y: 0, opacity: 1 }, { y: [0, 0.8, 0], opacity: [0.7, 1, 0.7] }) },
};

/** Every glyph AnimatedIcon can render (including purely static ones). */
export const ICON_NAMES = [
  "arrow",
  "spark",
  "gear",
  "bolt",
  "orbit",
  "download",
  "map",
  "layers",
  "wave",
  "chip",
  "mail",
  "github",
  "linkedin",
  "plus",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Resolve framer-motion props for one animated part of a glyph. */
export function iconMotion(name: string, part: string, reduce: boolean) {
  const spec = ICON_MOTION[name]?.[part];
  if (!spec) return { animate: undefined, transition: undefined };
  if (reduce) return { animate: spec.rest, transition: { duration: 0 } };
  return {
    animate: spec.active,
    transition: {
      duration: spec.duration,
      repeat: Infinity,
      ease: spec.ease,
      ...(spec.delay ? { delay: spec.delay } : {}),
    },
  };
}
