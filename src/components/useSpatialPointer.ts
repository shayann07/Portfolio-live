import { useCallback, useEffect, useRef } from "react";

const EASE = 0.14; // critically-damped feel without a spring lib
const EPS = 0.0015;

function motionAllowed() {
  if (typeof window === "undefined") return false;
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Smoothed pointer tracker for spatial surfaces.
 *
 * Writes `--px/--py` (specular light origin), `--rx/--ry` (clamped tilt) and
 * `--lift` (0..1 proximity) in a single rAF style write, easing toward the
 * target so motion never snaps. The loop parks itself once settled, so idle
 * panes cost zero frames — critical for mobile frame budget.
 */
export function useSpatialPointer<T extends HTMLElement>(tilt = 6) {
  const ref = useRef<T>(null);
  const enabled = useRef(false);
  const raf = useRef(0);
  const target = useRef({ x: 0.5, y: 0.5, l: 0 });
  const current = useRef({ x: 0.5, y: 0.5, l: 0 });

  const tick = useCallback(() => {
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    const c = current.current;
    const t = target.current;
    c.x += (t.x - c.x) * EASE;
    c.y += (t.y - c.y) * EASE;
    c.l += (t.l - c.l) * EASE;

    el.style.setProperty("--px", `${(c.x * 100).toFixed(2)}%`);
    el.style.setProperty("--py", `${(c.y * 100).toFixed(2)}%`);
    el.style.setProperty("--rx", `${((c.y - 0.5) * -2 * tilt).toFixed(3)}deg`);
    el.style.setProperty("--ry", `${((c.x - 0.5) * 2 * tilt).toFixed(3)}deg`);
    el.style.setProperty("--lift", c.l.toFixed(3));

    const settled =
      Math.abs(t.x - c.x) < EPS && Math.abs(t.y - c.y) < EPS && Math.abs(t.l - c.l) < EPS;
    if (!settled) raf.current = requestAnimationFrame(tick);
    else el.style.willChange = "auto";
  }, [tilt]);

  const kick = useCallback(() => {
    const el = ref.current;
    if (el) el.style.willChange = "transform";
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    enabled.current = motionAllowed();
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!enabled.current) return;
      const r = e.currentTarget.getBoundingClientRect();
      target.current = {
        x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
        y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
        l: 1,
      };
      kick();
    },
    [kick],
  );

  const onPointerLeave = useCallback(() => {
    if (!enabled.current) return;
    target.current = { x: 0.5, y: 0.5, l: 0 };
    kick();
  }, [kick]);

  return { ref, onPointerMove, onPointerLeave };
}

/**
 * Scene-level parallax for the hero / about stacks: one smoothed, clamped
 * global pointer read shared by every pane inside a `preserve-3d` root.
 * Listener attaches only when motion is allowed and the scene is on screen.
 */
export function useSceneParallax<T extends HTMLElement>(range = 12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;

    let raf = 0;
    let visible = false;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = () => {
      raf = 0;
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      el.style.setProperty("--ry", `${current.x.toFixed(3)}deg`);
      el.style.setProperty("--rx", `${current.y.toFixed(3)}deg`);
      el.style.setProperty("--px", `${(50 + current.x * 2).toFixed(2)}%`);
      el.style.setProperty("--py", `${(50 - current.y * 2).toFixed(2)}%`);
      if (Math.abs(target.x - current.x) > 0.01 || Math.abs(target.y - current.y) > 0.01) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      // clamped, eased response — extremes compress instead of clipping hard
      target.x = Math.tanh(nx * 1.6) * range;
      target.y = Math.tanh(ny * 1.6) * -range * 0.75;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          window.addEventListener("pointermove", onMove, { passive: true });
        } else {
          window.removeEventListener("pointermove", onMove);
          target.x = 0;
          target.y = 0;
          if (!raf) raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "12% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [range]);

  return ref;
}
