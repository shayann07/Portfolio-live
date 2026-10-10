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
  "medly",
  "invoiceone",
  "leafbloom",
  "upscaly",
  "streambox",
  "medicare",
  "gitpulse",
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
  medly: (
    <g transform="rotate(-40 12 12)">
      <rect {...BODY} x="3.5" y="9" width="17" height="6" rx="3" />
      <path {...ACC} d="M12 9v6" />
    </g>
  ),
  invoiceone: (
    <>
      <path {...BODY} d="M8 6.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 20 5v11" />
      <rect {...BODY} x="4" y="6.5" width="12.5" height="14" rx="2" />
      <path {...ACC} d="M7 11h6.5" />
      <path {...BODY} d="M7 15h6.5" />
    </>
  ),
  leafbloom: (
    <>
      <path {...BODY} d="M4.5 19.5C4.5 11.2 11.2 4.5 19.5 4.5c0 8.3-6.7 15-15 15z" />
      <path {...BODY} d="M7 17 17 7" />
      <path {...ACC} d="M5.5 13.5h9" />
    </>
  ),
  upscaly: (
    <>
      <rect {...BODY} x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <path {...BODY} d="M21 13.5V21h-7.5" />
      <path {...ACC} d="m11 11 8.6 8.6" />
    </>
  ),
  streambox: (
    <>
      <rect {...BODY} x="3" y="3" width="8" height="8" rx="1.6" />
      <rect {...BODY} x="13" y="3" width="8" height="8" rx="1.6" />
      <rect {...BODY} x="3" y="13" width="8" height="8" rx="1.6" />
      <rect {...ACC} x="13" y="13" width="8" height="8" rx="1.6" />
      <path d="M15.8 15.4v5.2l4.2-2.6z" fill={ACCENT} />
    </>
  ),
  medicare: (
    <>
      <path
        {...BODY}
        d="M12 20.5 4.9 13.4a4.6 4.6 0 1 1 6.4-6.5l.7.7.7-.7a4.6 4.6 0 1 1 6.4 6.5z"
      />
      <path {...ACC} d="M12 10v4.5M9.75 12.25h4.5" />
    </>
  ),
  gitpulse: (
    <>
      <path {...BODY} d="M3 12h3.6" />
      <path {...ACC} d="m6.6 12 2.6-5.4 3.4 11 2.6-5.6" />
      <path {...BODY} d="M15.2 12H21" />
      <circle {...BODY} cx="3" cy="12" r="1.5" />
      <circle {...BODY} cx="21" cy="12" r="1.5" />
    </>
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
