# portfolio-mockup

A React + TypeScript + Vite **single-page portfolio website** for Muhammad Shayan (Senior Android / Flutter Engineer). Dark theme, gradient overlays, Framer Motion animations, Lenis smooth scrolling on desktop, custom cursor glow, and 10 vertically stacked sections. ~54 TS/TSX files, ~4,500 LOC. Production-ready; contact form is `mailto:`-only. MIT licensed.

## ⚠ Heads-up: previous README claims that aren't true

The previous README listed **Radix UI** and **React Router DOM 6.8.1** as part of the tech stack. Neither is used:

- `@radix-ui/react-slot`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group` are in `package.json` but **not imported** anywhere in `src/`. The Acknowledgments line linking to Radix UI was inaccurate.
- `react-router-dom` is in `package.json` but **not imported** anywhere. The site is a single-page scrolling portfolio with no router — there are no routes, no `<BrowserRouter>`, no `<Routes>`.
- `class-variance-authority` is also declared but unused.
- `lucide-react` is used in exactly one file (`Footer`); the rest of the icons come from hardcoded **remote Anima CDN URLs** in `src/config/icons.ts:2` (with an inline `TODO` to localise them to `src/assets/`).

Trim these dependencies before treating this as the final stack.

## Status

- Working tree clean on `main`. Total commits: 44, but the most recent 10+ are `Update repository metadata (GitPulse)` (`80d62e7`, `122071d`, `e18ec20`, `c49bee8`, `aaf24d4`, …) — the real product commits sit beneath.
- Remote: `https://github.com/shayann07/portfolio-mockup.git`.
- The README previously contained 15 trailing `<!-- gitpulse:contribution -->` HTML comment markers (lines 185-199). They have been removed in this rewrite.

## ✨ Sections (all real, all implemented)

- **Navbar** — sticky top nav with scroll-into-view links.
- **Hero** — animated raindrop particles, gradient overlays, hero copy + project cards.
- **Story** — interactive timeline of professional milestones.
- **CommandCenter** — performance-metric cards with animated bar charts and status indicators.
- **Projects** — featured projects with custom (Anima-hosted) icons, technology tags, and metrics.
- **Skills** — categorised skill sets (Mobile, Architecture, Backend, Database, ML, Tools/DevOps, Testing).
- **Lab** — experimental projects / prototypes.
- **CTA** — call-to-action band.
- **Contact** — `mailto:` form + social links. **No backend** — submissions open the user's mail client; they are not posted anywhere.
- **Footer** — social row + copyright.

Animation variants live in `src/utils/animation-variants.ts`. The cursor-glow effect (`src/components/CursorGlow.tsx`) is disabled on mobile via the `useMobile` hook; Lenis smooth scroll is desktop-only too.

## 🛠️ Tech stack (real)

- **Framework:** React 18.2.0 + TypeScript.
- **Build:** Vite 6.3.5 (`npm run dev` on port 5173, `npm run build` → `dist/`).
- **Styling:** Tailwind CSS 3.4.16 (`tailwind.config.js`, `tailwind.css`).
- **Animation:** framer-motion 11.0.0.
- **Smooth scroll:** lenis 1.3.16 (desktop only).
- **SEO:** react-helmet-async 2.0.5.
- **Icons:** lucide-react 0.453.0 (used in `Footer` only) + hardcoded remote Anima SVGs in `src/config/icons.ts`.

**Declared but unused:** react-router-dom 6.8.1, class-variance-authority 0.7.0, `@radix-ui/react-slot`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`. Drop these from `package.json`.

## 📦 Setup / run

```bash
git clone https://github.com/shayann07/portfolio-mockup.git
cd portfolio-mockup
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

No `.env`, no API keys, no backend.

## 📁 Project structure

```
portfolio-mockup/
├── index.html                       Vite entry, mounts #root
├── public/
│   ├── muhammad_shayan_cv.pdf
│   └── og-image.png
├── src/
│   ├── App.tsx                      lazy-loads sections, mounts CursorGlow
│   ├── index.tsx                    bootstraps with HelmetProvider
│   ├── components/                  CursorGlow, SectionHeader, CardParticles, SEO
│   ├── config/                      icons.ts (remote Anima URLs), links.ts, personalLinks.ts
│   ├── hooks/                       useMobile, useScrollAnimation
│   ├── sections/                    Navbar, Hero, Story, CommandCenter, Projects, Skills, Lab, CTA, Contact, Footer
│   └── utils/animation-variants.ts
├── tailwind.config.js
├── tailwind.css
├── tsconfig.{json,app,node}.json
├── vite.config.ts
├── LICENSE                          MIT, © 2025 Shayan Khan
└── README.md
```

## 📝 Configuration

- **Personal info / contact / social:** `src/config/personalLinks.ts`.
- **Navigation + external links:** `src/config/links.ts`.
- **Icons:** `src/config/icons.ts` — currently points at remote Anima SVG URLs. Localise to `src/assets/` before going to production (TODO already noted in the file).
- **Tailwind theme:** `tailwind.config.js`.

## Honest limitations

- **Three Radix packages, React Router, and class-variance-authority are listed in `package.json` but never imported.** Drop them — they bloat `node_modules` and confuse readers.
- **Icons are loaded from a third-party Anima CDN URL.** If the CDN rotates the asset paths, every icon breaks. The `TODO` in `src/config/icons.ts:2` has been there from the start.
- **Contact form is a `mailto:` link.** Submissions open the user's local mail client; they are not posted to a backend or saved anywhere.
- **No ESLint, no Prettier, no TypeScript strict mode** are configured.
- **No tests.** Visual portfolio; not a critical gap, but `useMobile` and `animation-variants` are easy unit-test targets.

## License

MIT — see [`LICENSE`](LICENSE). © 2025 Shayan Khan.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/).
- Animations by [Framer Motion](https://www.framer.com/motion/).
- Smooth scroll by [Lenis](https://lenis.studiofreight.com/).
- Styled with [Tailwind CSS](https://tailwindcss.com/).
- Icon usage in `Footer` from [Lucide](https://lucide.dev/); the remaining icon assets are hosted on the Anima CDN.
