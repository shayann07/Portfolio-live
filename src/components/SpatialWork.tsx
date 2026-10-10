import { AnimatedIcon } from "./AnimatedIcon";
import { ProjectMark, type ProjectMarkName } from "./ProjectMark";
import { useSpatialPointer } from "./useSpatialPointer";

/**
 * A scene is keyed by the project's mark, so the glyph and the diorama can
 * never drift apart — one project, one identity.
 */
type SceneName = ProjectMarkName;

/** Small helper so the repetitive grid children stay readable. */
const cells = (n: number, hot: Record<number, string> = {}) =>
  Array.from({ length: n }, (_, i) => <i key={i} className={hot[i] ?? undefined} />);

/** Per-project spatial diorama: layered planes over a perspective floor. */
function WorkScene({ variant, badge }: { variant: SceneName; badge?: string }) {
  return (
    <span className="wscene" data-scene={variant} aria-hidden>
      <span className="wscene__shadow" />
      <span className="wscene__glow" />
      <span className="wscene__stage">
        {variant === "medly" && (
          <>
            <span className="wplane wp--sheet">
              <i className="wrow" />
              <i className="wrow" />
              <i className="wrow" />
            </span>
            <span className="wcapsule" />
          </>
        )}
        {variant === "invoiceone" && (
          <>
            <span className="wplane wp--t1" />
            <span className="wplane wp--t2" />
            <span className="wplane wp--t3" />
            <span className="wplane wp--t4">
              <i className="wrow" />
              <i className="wrow" />
              <i className="wrow" />
            </span>
          </>
        )}
        {variant === "leafbloom" && (
          <span className="wplane wp--cam">
            <span className="wleaf" />
            <span className="wscan" />
          </span>
        )}
        {variant === "upscaly" && (
          <>
            <span className="wplane wp--lo">
              <span className="wpx wpx--lo" />
            </span>
            <span className="wplane wp--hi">
              <span className="wpx wpx--hi" />
            </span>
          </>
        )}
        {variant === "streambox" && <span className="wmatrix">{cells(6, { 4: "is-live" })}</span>}
        {variant === "medicare" && (
          <span className="wplane wp--cal">
            <span className="wslots">{cells(12, { 6: "is-booked" })}</span>
          </span>
        )}
        {variant === "gitpulse" && (
          <span className="wplane wp--grid">
            <span className="wcontrib">
              {cells(24, { 3: "is-warm", 6: "is-hot", 9: "is-warm", 14: "is-hot", 19: "is-warm" })}
            </span>
          </span>
        )}
        {badge && (
          <span
            className={`wtag ${variant === "medicare" || variant === "gitpulse" ? "wtag--b" : "wtag--a"}`}
          >
            {badge}
          </span>
        )}
      </span>
    </span>
  );
}

export type WorkItem = {
  /** Anchor id so the hero proof-strip can deep-link to the project that backs a claim. */
  id: string;
  title: string;
  desc: string;
  tag: string;
  year: string;
  /** Per-project glyph; also selects the diorama. */
  mark: ProjectMarkName;
  /** A verifiable fact from the repo, shown on the diorama. */
  badge?: string;
  href: string;
  /**
   * Where the card sends you. A boolean public/private cannot express a store
   * listing for a project whose source stays closed, so this is an enum.
   */
  link: "source" | "store" | "contact";
};

/** One depth-layered project pane with pointer tilt + glow trail. */
function WorkPane({ item, index }: { item: WorkItem; index: number }) {
  const { ref, onPointerMove, onPointerLeave } = useSpatialPointer<HTMLAnchorElement>(7);
  const depth = index % 2 === 0 ? "near" : "far";
  const cta = {
    source: { label: "Source", icon: "github", cursor: "Source", hint: "View source on GitHub" },
    store: {
      label: "Play Store",
      icon: "download",
      cursor: "Install",
      hint: "View on Google Play",
    },
    contact: { label: "Private · ask me", icon: "mail", cursor: "Ask", hint: "" },
  }[item.link];
  const external = item.link !== "contact";

  return (
    <a
      ref={ref}
      id={item.id}
      href={item.href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      data-cursor={cta.cursor}
      data-depth={depth}
      className="work-pane spatial-interactive"
      style={{ ["--pane-delay" as string]: `${index * 0.09}s` }}
      aria-label={
        external
          ? `${item.title} — ${item.tag}, ${item.year}. ${cta.hint} (opens in a new tab).`
          : `${item.title} — ${item.tag}, ${item.year}. Private repository — get in touch to discuss it.`
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onBlur={onPointerLeave}
    >
      <span className="work-pane__trail" aria-hidden />
      <span className="work-pane__inner">
        <span className="work-pane__top">
          <span className="work-pane__ident">
            <span className="work-pane__mark">
              <ProjectMark name={item.mark} size={22} />
            </span>
            <span className="work-pane__num">{String(index + 1).padStart(2, "0")}</span>
          </span>
          <span className="work-pane__year unit">{item.year}</span>
        </span>

        <span className="work-pane__art" aria-hidden>
          <WorkScene variant={item.mark} badge={item.badge} />
        </span>

        <span className="work-pane__body">
          <h3 className="work-pane__title">{item.title}</h3>
          <span className="body-sm mt-2 block">{item.desc}</span>
          <span className="mt-3 flex items-center justify-between gap-3">
            <span className="eyebrow">{item.tag}</span>
            <span className="work-pane__cta eyebrow">
              {cta.label}
              <span className="work-pane__arrow" aria-hidden>
                <AnimatedIcon name={cta.icon} size={14} />
              </span>
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}

export function SpatialWork({ items }: { items: WorkItem[] }) {
  return (
    <ul className="work-panes">
      {items.map((w, i) => (
        <li key={w.title}>
          <WorkPane item={w} index={i} />
        </li>
      ))}
    </ul>
  );
}

export default SpatialWork;
