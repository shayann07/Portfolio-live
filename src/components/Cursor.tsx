import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setEnabled(false);
      return;
    }
    document.documentElement.dataset.customCursor = "";
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2,
      rx = x,
      ry = y;
    let shown = false;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        // Stay invisible until the first move so nothing sits at the viewport centre.
        shown = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
    };
    window.addEventListener("pointermove", move);

    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor || null);
    };
    document.addEventListener("mouseover", over);
    return () => {
      delete document.documentElement.dataset.customCursor;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-10 w-10 rounded-full border border-white/40 mix-blend-difference"
        style={{ opacity: 0, transition: "opacity var(--dur-quick) var(--ease-out)" }}
        aria-hidden
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[71] h-2 w-2 rounded-full bg-white mix-blend-difference"
        style={{ opacity: 0 }}
        aria-hidden
      />
      {label && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-[72]"
          style={{ transform: `translate3d(${16}px, 0, 0)` }}
        />
      )}
    </>
  );
}
