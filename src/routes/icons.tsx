import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { ICON_MOTION, ICON_NAMES } from "@/components/iconMotion";

export const Route = createFileRoute("/icons")({
  head: () => ({
    meta: [
      { title: "Icon Gallery — Muhammad Shayan" },
      {
        name: "description",
        content:
          "Preview of every AnimatedIcon glyph with sizes, motion specs, and a reduced-motion toggle.",
      },
      { property: "og:title", content: "Icon Gallery — Muhammad Shayan" },
      {
        property: "og:description",
        content:
          "Every AnimatedIcon variant, previewed at multiple sizes with a reduced-motion toggle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      // Internal design-system gallery, not portfolio content.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: IconGallery,
});

const SIZES = [16, 20, 28, 40];

function IconGallery() {
  const [reduced, setReduced] = useState(false);

  return (
    <main className="relative z-10 min-h-svh bg-black text-[color:var(--platinum,#e9e9ec)]">
      <div className="section" data-reduced={reduced ? "true" : "false"}>
        <header className="section-head flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="body-sm opacity-60">Internal / QA</p>
            <h1 className="hd-2">Icon gallery</h1>
            <p className="body-sm opacity-70">
              {ICON_NAMES.length} glyphs · toggle reduced motion to verify every icon settles into a
              static rest state.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            aria-pressed={reduced}
            data-testid="reduced-motion-toggle"
            onClick={() => setReduced((v) => !v)}
          >
            Reduced motion: {reduced ? "On" : "Off"}
          </button>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ICON_NAMES.map((name) => {
            const parts = ICON_MOTION[name];
            return (
              <li key={name} className="glass rounded-2xl p-4" data-icon-cell={name}>
                <div className="flex items-end gap-4">
                  {SIZES.map((size) => (
                    <span
                      key={size}
                      className="icon-box"
                      style={{ inlineSize: size + 8, blockSize: size + 8 }}
                    >
                      <AnimatedIcon name={name} size={size} forceReducedMotion={reduced} />
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-xs tracking-wide">{name}</p>
                <p className="body-sm text-xs opacity-55">
                  {parts
                    ? Object.entries(parts)
                        .map(
                          ([part, spec]) =>
                            `${part} ${spec.duration}s${spec.direction ? ` ${spec.direction}` : ""}`,
                        )
                        .join(" · ")
                    : "static"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
