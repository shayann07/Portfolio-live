import { scrollToHash } from "@/hooks/useSectionNav";

const ITEMS = [
  { id: "top", label: "Intro", mobileLabel: "Intro" },
  { id: "about", label: "About", mobileLabel: "About" },
  { id: "story", label: "Path", mobileLabel: "Path" },
  { id: "work", label: "Work", mobileLabel: "Work" },
  { id: "open-source", label: "Open Source", mobileLabel: "OSS" },
  { id: "lab", label: "Lab", mobileLabel: "Lab" },
  { id: "contact", label: "Contact", mobileLabel: "Contact" },
];

/**
 * Floating spatial navigator: vertical depth rail on desktop, tappable dot
 * cluster on mobile. Tracks the active section and scrolls smoothly.
 */
export function SpatialNav({ active, hasOSS = true }: { active: string; hasOSS?: boolean }) {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href") ?? "";
    if (scrollToHash(href)) e.preventDefault();
  };

  const items = hasOSS ? ITEMS : ITEMS.filter((it) => it.id !== "open-source");

  return (
    <nav aria-label="Section navigation" className="snav">
      <ul className="snav__list">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={go}
                className="snav__item spatial-interactive"
                data-active={on || undefined}
                aria-current={on ? "true" : undefined}
                aria-label={it.label}
              >
                <span className="snav__label">{it.mobileLabel || it.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SpatialNav;
