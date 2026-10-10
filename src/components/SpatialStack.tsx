import { AnimatedIcon } from "./AnimatedIcon";
import { useSceneParallax } from "./useSpatialPointer";

/**
 * Spatial UI: a visionOS-style stack of floating glass panes rendered in real
 * 3D perspective. Panes sit at different Z depths and respond to pointer with
 * a single rAF-throttled transform write on the scene root (no per-pane state).
 */
const TARGETS = ["Android", "iOS", "Desktop", "Web"];

export function SpatialStack() {
  const ref = useSceneParallax<HTMLDivElement>(12);

  return (
    <div className="spatial" ref={ref} aria-hidden>
      <div className="spatial__scene">
        {/* deepest: ambient light field */}
        <span className="spatial__glow" />

        {/* back pane: the four targets */}
        <span className="spatial__contact spatial__contact--back" />
        <div className="spatial__pane spatial__pane--back">
          <span className="spatial__sheen" />
          <div className="spatial__paneHead">
            <span className="spatial__label">Platforms</span>
            <span className="spatial__label spatial__label--unit">4</span>
          </div>
          <div className="spatial__bars">
            {TARGETS.map((name, i) => (
              <span key={name} style={{ height: "78%", animationDelay: `${i * 0.16}s` }} />
            ))}
          </div>
          <span className="spatial__baseline" />
        </div>

        {/* mid pane: module grid */}
        <span className="spatial__contact spatial__contact--mid" />
        <div className="spatial__pane spatial__pane--mid">
          <span className="spatial__sheen" />
          <div className="spatial__grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                data-hot={i === 4 ? "" : undefined}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <span className="spatial__scan" />
        </div>

        {/* front pane: the headline fact */}
        <span className="spatial__contact spatial__contact--front" />
        <div className="spatial__pane spatial__pane--front">
          <span className="spatial__sheen" />
          <div className="spatial__row spatial__row--between">
            <span className="spatial__label status-live">One codebase</span>
            <span className="spatial__icon spatial__icon--sm">
              <AnimatedIcon name="chip" size={18} />
            </span>
          </div>
          <div className="spatial__readout">
            <strong>4</strong>
            <span className="spatial__label spatial__label--unit">targets</span>
          </div>
          <div className="spatial__targets">
            {TARGETS.map((name) => (
              <span key={name} className="spatial__label spatial__label--unit">
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* floating satellite chip */}
        <div className="spatial__pane spatial__pane--chip">
          <AnimatedIcon name="spark" size={16} />
        </div>
      </div>
    </div>
  );
}

export default SpatialStack;

/**
 * Secondary spatial cluster used beside body copy: shallower depth, same
 * liquid-glass language. Pointer parallax shares the rAF-throttled approach.
 */
export function SpatialCluster() {
  const ref = useSceneParallax<HTMLDivElement>(8);

  return (
    <div className="spatial-cluster" ref={ref} aria-hidden>
      <div className="spatial-cluster__scene">
        <span className="spatial-cluster__glow" />

        <span className="spatial-cluster__rule" />

        <span className="spatial__contact spatial__contact--slab" />
        <div className="spatial-slab">
          <span className="spatial__sheen" />
          <div className="spatial-slab__head">
            <span className="spatial__label status-live">Stack</span>
          </div>
          <ul className="spatial-slab__rows">
            {["Kotlin Multiplatform", "Compose Multiplatform", "Ktor & SQLDelight"].map((t, i) => (
              <li key={t} style={{ animationDelay: `${i * 0.9}s` }}>
                <i />
                <span className="spatial__label">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="spatial-gauge">
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle className="spatial-gauge__track" cx="50" cy="50" r="42" />
            <circle className="spatial-gauge__arc" cx="50" cy="50" r="42" />
          </svg>
          <div className="spatial-gauge__mid">
            <strong>8</strong>
            <span className="spatial__label spatial__label--unit">apps</span>
          </div>
        </div>

        <div className="spatial-tag">
          <span className="spatial__label">Islamabad, PKT</span>
        </div>

        <div className="spatial-chipfloat">
          <AnimatedIcon name="layers" size={18} />
        </div>
      </div>
    </div>
  );
}
