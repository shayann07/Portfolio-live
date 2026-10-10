import { useEffect } from "react";

/**
 * Pauses decorative animation outside the viewport.
 *
 * The dioramas, glows and floating tags all run `infinite` keyframes. Left
 * alone that is ~100 simultaneous animations on this page, the overwhelming
 * majority of them scrolled far out of view, each still asking the compositor
 * for work on every frame. That is what makes scrolling feel heavy.
 *
 * One shared observer flips `data-idle` on each scene root; the stylesheet
 * pauses everything inside an idle root. Pausing (rather than removing the
 * animation) keeps the element's resting frame, so nothing shifts on re-entry.
 */
const SCENE_SELECTOR = ".wscene, .spatial, .spatial-cluster";

export function useIdleScenes() {
  useEffect(() => {
    const roots = Array.from(document.querySelectorAll<HTMLElement>(SCENE_SELECTOR));
    if (!roots.length) return;

    // Generous margin so a scene is already running before it scrolls in.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.idle = entry.isIntersecting ? "false" : "true";
        }
      },
      { rootMargin: "300px 0px" },
    );

    // Deliberately not seeded to "true": anything above the fold would then sit
    // frozen until the first observer callback. Unset means running, and the
    // observer pauses only what is genuinely away.
    for (const el of roots) io.observe(el);
    return () => io.disconnect();
  }, []);
}
