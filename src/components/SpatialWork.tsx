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
function WorkScene({ variant }: { variant: SceneName }) {
  return (
    <span className="wscene" data-scene={variant} aria-hidden>
      <span className="wscene__shadow" />
      <span className="wscene__glow" />
      <span className="wscene__stage">
        {variant === "urducanvas" && (
          <>
            <span className="wplane wp--canvas-back" />
            <span className="wplane wp--canvas-front">
              <span className="wstroke" />
              <i className="wrow" />
              <i className="wrow" />
            </span>
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
        {variant === "liquidglass" && (
          <>
            <span className="wplane wp--lg-grad" />
            <span className="wplane wp--lg-glass">
              <span className="wrefract" />
            </span>
          </>
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
        {variant === "urduspeech" && (
          <span className="wplane wp--wave">
            <span className="wwaveform">
              {cells(16, { 4: "is-peak", 5: "is-peak", 9: "is-peak", 10: "is-peak" })}
            </span>
          </span>
        )}
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
  /** A verifiable fact, shown beside the year in the card header. */
  badge?: string;
  href?: string;
  /**
   * Where the card sends you. A boolean public/private cannot express a store
   * listing for a project whose source stays closed, so this is an enum.
   */
  link: "source" | "store" | "site" | "soon";
};

/** One depth-layered project pane with pointer tilt + glow trail. */
function WorkPane({ item, index }: { item: WorkItem; index: number }) {
  const { ref, onPointerMove, onPointerLeave } = useSpatialPointer<HTMLElement>(7);
  const depth = index % 2 === 0 ? "near" : "far";
  const cta = {
    source: { label: "Source", icon: "github", cursor: "Source", hint: "View source on GitHub" },
    store: {
      label: "Play Store",
      icon: "download",
      cursor: "Install",
      hint: "View on Google Play",
    },
    site: {
      label: "Website",
      icon: "arrow",
      cursor: "Visit",
      hint: "Visit website",
    },
    soon: {
      label: "Coming soon",
      icon: "arrow",
      cursor: "Soon",
      hint: "Not yet released",
    },
  }[item.link];

  const content = (
    <>
      <span className="work-pane__trail" aria-hidden />
      <span className="work-pane__inner">
        <span className="work-pane__top">
          <span className="work-pane__ident">
            <span className="work-pane__mark">
              <ProjectMark name={item.mark} size={22} />
            </span>
            <span className="work-pane__num">{String(index + 1).padStart(2, "0")}</span>
          </span>
          <span className="work-pane__year unit">
            {item.badge ? `${item.badge} · ` : ""}
            {item.year}
          </span>
        </span>

        <span className="work-pane__art" aria-hidden>
          <WorkScene variant={item.mark} />
        </span>

        <span className="work-pane__body">
          <h3 className="work-pane__title">{item.title}</h3>
          <span className="body-sm mt-2 block">{item.desc}</span>
          <span className="mt-3 flex items-center justify-between gap-3">
            <span className="eyebrow">{item.tag}</span>
            <span className="work-pane__cta eyebrow">
              {cta.label}
              {item.link !== "soon" && (
                <span className="work-pane__arrow" aria-hidden>
                  <AnimatedIcon name={cta.icon} size={14} />
                </span>
              )}
            </span>
          </span>
        </span>
      </span>
    </>
  );

  if (item.link === "soon") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        id={item.id}
        role="group"
        data-depth={depth}
        className="work-pane spatial-interactive"
        style={{ ["--pane-delay" as string]: `${index * 0.09}s` }}
        aria-label={`${item.title} — ${item.tag}, ${item.year}. Not yet released.`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onBlur={onPointerLeave}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      id={item.id}
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor={cta.cursor}
      data-depth={depth}
      className="work-pane spatial-interactive"
      style={{ ["--pane-delay" as string]: `${index * 0.09}s` }}
      aria-label={`${item.title} — ${item.tag}, ${item.year}. ${cta.hint} (opens in a new tab).`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onBlur={onPointerLeave}
    >
      {content}
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
