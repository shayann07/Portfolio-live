import { useCallback, useEffect, useState } from "react";

export const SECTION_IDS = ["top", "about", "story", "work", "lab", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

function headerOffset() {
  if (typeof window === "undefined") return 96;
  return window.matchMedia("(min-width: 768px)").matches ? 96 : 80;
}

function prefersReduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Scrolls a hash target into place accounting for the fixed glass header. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return false;
  // Focus first: focusing can itself nudge the scroll position (scroll-padding),
  // so the explicit scroll must come last to own the final offset.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced() ? "auto" : "smooth" });
  history.replaceState(null, "", `#${id}`);
  return true;
}

/**
 * Active-section tracking + a click handler that performs offset-aware
 * smooth scrolling for every in-page anchor.
 */
export function useSectionNav() {
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!els.length) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.scrollY + headerOffset() + window.innerHeight * 0.22;
      let current = els[0].id;
      for (const el of els) {
        if (el.offsetTop <= line) current = el.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    if (scrollToHash(href)) e.preventDefault();
  }, []);

  // Deep links (/#work) land correctly once layout settles.
  useEffect(() => {
    if (!window.location.hash) return;
    const t = window.setTimeout(() => scrollToHash(window.location.hash), 120);
    return () => window.clearTimeout(t);
  }, []);

  return { active, onNavClick };
}
