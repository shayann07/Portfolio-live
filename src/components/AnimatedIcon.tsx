import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { iconMotion, ORBIT_GEOMETRY } from "@/components/iconMotion";

type Props = { name: string; className?: string; size?: number; forceReducedMotion?: boolean };

/**
 * All glyphs are drawn on a 24x24 grid with a consistent 2px optical padding,
 * so every icon occupies an identical square box and aligns across tiles.
 * Under prefers-reduced-motion (or forceReducedMotion) every glyph renders in
 * its resting state. Timing/direction lives in `iconMotion.ts`.
 */
export const AnimatedIcon = memo(function AnimatedIcon({
  name,
  className = "",
  size = 20,
  forceReducedMotion,
}: Props) {
  const prefersReduce = useReducedMotion();
  const reduce = forceReducedMotion ?? !!prefersReduce;
  const sw = 1.6;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `block shrink-0 ${className}`,
    style: { width: size, height: size },
    "aria-hidden": true,
    focusable: false,
    "data-icon": name,
  };
  const m = (part: string) => iconMotion(name, part, reduce);
  const { outerRing, innerRing, satellite } = ORBIT_GEOMETRY;

  switch (name) {
    case "arrow":
      return (
        <motion.svg {...common} {...m("body")}>
          <path d="M4 12h13" />
          <path d="M13 7l5 5-5 5" />
        </motion.svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <motion.path d="M12 3v5M12 16v5M3 12h5M16 12h5" {...m("cross")} />
          <motion.path
            d="M5.8 5.8l3 3M15.2 15.2l3 3M18.2 5.8l-3 3M8.8 15.2l-3 3"
            opacity="0.55"
            {...m("diagonals")}
          />
        </svg>
      );
    case "gear":
      return (
        <motion.svg
          {...common}
          style={{ ...common.style, transformOrigin: "50% 50%" }}
          {...m("body")}
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M5.2 18.8L7.3 16.7M16.7 7.3l2.1-2.1" />
        </motion.svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <motion.path
            d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z"
            fill="currentColor"
            fillOpacity="0.16"
            style={{ transformOrigin: "50% 50%" }}
            {...m("body")}
          />
        </svg>
      );
    case "orbit":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          {/* outer ring: clockwise */}
          <motion.g data-part="outer" style={{ transformOrigin: "12px 12px" }} {...m("outer")}>
            <ellipse cx="12" cy="12" rx={outerRing.rx} ry={outerRing.ry} opacity="0.5" />
            <circle
              data-part="satellite"
              cx={satellite.cx}
              cy={satellite.cy}
              r={satellite.r}
              fill="currentColor"
              stroke="none"
            />
          </motion.g>
          {/* inner ring: counter-clockwise for depth */}
          <motion.g data-part="inner" style={{ transformOrigin: "12px 12px" }} {...m("inner")}>
            <ellipse cx="12" cy="12" rx={innerRing.rx} ry={innerRing.ry} opacity="0.28" />
          </motion.g>
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <motion.g {...m("arrowhead")}>
            <path d="M12 3.5v9" />
            <path d="M8.2 9.2l3.8 3.8 3.8-3.8" />
          </motion.g>
          <path d="M4.5 17v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" opacity="0.7" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path
            d="M9 4.5L3.5 6.8v12.7L9 17.2l6 2.3 5.5-2.3V4.5L15 6.8 9 4.5z"
            fill="currentColor"
            fillOpacity="0.12"
          />
          <path d="M9 4.5v12.7M15 6.8v12.7" opacity="0.55" />
          <motion.circle
            cx="12"
            cy="11"
            r="1.8"
            fill="currentColor"
            stroke="none"
            style={{ transformOrigin: "12px 11px" }}
            {...m("pin")}
          />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <motion.path
            d="M12 3l8 4.5-8 4.5-8-4.5L12 3z"
            fill="currentColor"
            fillOpacity="0.16"
            {...m("top")}
          />
          <motion.path d="M4 12l8 4.5 8-4.5" opacity="0.75" {...m("mid")} />
          <motion.path d="M4 16.5L12 21l8-4.5" opacity="0.45" {...m("bottom")} />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <motion.path d="M2 11.5c2.5-5 5-5 7.5 0s5 5 7.5 0 5-5 5 0" {...m("front")} />
          <motion.path
            d="M2 16.5c2.5-4 5-4 7.5 0s5 4 7.5 0 5-4 5 0"
            opacity="0.45"
            {...m("back")}
          />
        </svg>
      );
    case "chip":
      return (
        <svg {...common}>
          <rect
            x="7"
            y="7"
            width="10"
            height="10"
            rx="2.5"
            fill="currentColor"
            fillOpacity="0.14"
          />
          <motion.rect
            x="10.25"
            y="10.25"
            width="3.5"
            height="3.5"
            rx="1"
            fill="currentColor"
            stroke="none"
            {...m("core")}
          />
          <path
            d="M10 3.5v3.5M14 3.5v3.5M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5"
            opacity="0.65"
          />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <motion.path d="M3.5 7.5l8.5 5.5 8.5-5.5" {...m("flap")} />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4 1.5-4-2-6-2m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C7.7 4 6.7 4.3 6.7 4.3a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 5.3 10.7c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2.5" y="9" width="4" height="12" />
          <circle cx="4.5" cy="4.5" r="2" />
        </svg>
      );
    case "plus":
      return (
        <motion.svg
          {...common}
          whileHover={reduce ? undefined : { rotate: 90 }}
          transition={{ duration: 0.35 }}
        >
          <path d="M12 5v14M5 12h14" />
        </motion.svg>
      );
    default:
      return null;
  }
});
