/**
 * Per-project glyphs for the Selected Work cards.
 *
 * The dioramas behind each card cycle through four scenes, so with seven
 * projects three pairs share artwork. These give every project its own
 * identity in the one place a reader looks first.
 *
 * House rules: 24px grid, 1.6 stroke, round caps and joins, exactly one
 * crimson accent per mark. The body strokes use `currentColor` so a mark
 * inherits whatever the card is doing on hover or focus.
 */

export const PROJECT_MARKS = [
  "urducanvas",
  "invoiceone",
  "liquidglass",
  "upscaly",
  "urduspeech",
  "medly",
] as const;

export type ProjectMarkName = (typeof PROJECT_MARKS)[number];

const ACCENT = "rgb(var(--crimson-rgb))";

const BODY = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ACC = { ...BODY, stroke: ACCENT } as const;

const SHAPES: Record<ProjectMarkName, React.ReactNode> = {
  urducanvas: (
    <>
      <rect {...BODY} x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path {...BODY} d="M7 15.5h10" />
      <path {...ACC} d="M7 11.5c3.5 0 4.5-4 10-4" />
    </>
  ),
  invoiceone: (
    <>
      <path {...BODY} d="M8 6.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 20 5v11" />
      <rect {...BODY} x="4" y="6.5" width="12.5" height="14" rx="2" />
      <path {...ACC} d="M7 11h6.5" />
      <path {...BODY} d="M7 15h6.5" />
    </>
  ),
  liquidglass: (
    <>
      <circle {...BODY} cx="12" cy="12" r="7.5" />
      <path {...BODY} d="M7 15a5.5 5.5 0 0 0 5 2" />
      <path {...ACC} d="M8 8a5.5 5.5 0 0 1 8 5" />
    </>
  ),
  upscaly: (
    <>
      <rect {...BODY} x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <path {...BODY} d="M21 13.5V21h-7.5" />
      <path {...ACC} d="m11 11 8.6 8.6" />
    </>
  ),
  urduspeech: (
    <>
      <rect {...BODY} x="8" y="3.5" width="8" height="10" rx="4" />
      <path {...BODY} d="M5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v3" />
      <path {...ACC} d="M4 20.5c2.5-1.5 5.5-1.5 8 0s5.5 1.5 8 0" />
    </>
  ),
  medly: (
    <g transform="rotate(-40 12 12)">
      <rect {...BODY} x="3.5" y="9" width="17" height="6" rx="3" />
      <path {...ACC} d="M12 9v6" />
    </g>
  ),
};

export function ProjectMark({ name, size = 24 }: { name: ProjectMarkName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="project-mark"
    >
      {SHAPES[name]}
    </svg>
  );
}

export default ProjectMark;
