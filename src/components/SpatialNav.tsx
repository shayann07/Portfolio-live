import { scrollToHash } from "@/hooks/useSectionNav";

const ITEMS = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "story", label: "Path" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
];

/**
 * Floating spatial navigator: vertical depth rail on desktop, tappable dot
 * cluster on mobile. Tracks the active section and scrolls smoothly.
 */
export function SpatialNav({ active }: { active: string }) {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href") ?? "";
    if (scrollToHash(href)) e.preventDefault();
  };

  return (
    <nav aria-label="Section navigation" className="snav">
      <ul className="snav__list">
        {ITEMS.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={go}
                className="snav__item spatial-interactive"
                data-active={on || undefined}
                aria-current={on ? "true" : undefined}
              >
                <span className="snav__dot" aria-hidden />
                <span className="snav__label">{it.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SpatialNav;
