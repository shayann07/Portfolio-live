# ANTIGRAVITY TASK — Reposition the portfolio as a Kotlin Multiplatform developer

Owner: Muhammad Shayan (shayann07) · Site: https://shayxo.dev · Repo: this one (`Porfolio-dev`)
Stack: TanStack Start (SSR) · React 19 · Tailwind v4 · Framer Motion · Vite 8 · Vitest

Read this whole file before touching code. Do the tasks in order. Every fact in section 2 is verified;
do not invent numbers, links or claims that are not in this file. Anything marked **OWNER** is a
decision or input only the owner can give: use the stated default and list it in your final report.

---

## 0. Ground rules

1. **Lovable sync.** This repo is connected to Lovable (see `AGENTS.md`). Never rewrite pushed git
   history: no force-push, rebase, amend or squash of pushed commits. Make normal commits. Keep the
   branch in a working state after each task.
2. **Keep the design language.** Dark, glassy, spatial. Do not restyle the site, change fonts,
   colours, the shader background, the cursor, or the spatial nav behaviour. New UI must reuse the
   existing primitives (`.glass`, `.work-pane`, `.wscene`, `.eyebrow`, `Reveal`, `AnimatedIcon`).
3. **Copy voice.** Plain, confident, short. Match the existing tone in `src/routes/index.tsx`
   ("Products, shipped.", "How I got here."). No buzzword stacking, no emojis.
4. **No secrets in the repo or the client bundle.** The GitHub token (task 5) is read from a server
   environment variable only.
5. **Verify as you go.** After each task run `npm run lint`, `npm run test`, and `npm run build`.
   Finish with the checks in section 7.
6. **Do not edit** `src/routeTree.gen.ts` by hand (generated), or anything in `brand/`.

---

## 1. Goal

The portfolio currently reads as a generalist "software engineer" with Android, Flutter, fintech
and MLM-backend work mixed in. The owner is repositioning as a **Kotlin Multiplatform developer**.
The site should show **fewer, stronger** projects (the quality bar is the owner's GitHub profile
README), real **open-source contributions** pulled live from GitHub, and facts that match the owner's
new CV.

---

## 2. Source of truth (verified facts)

### Identity
- Name on site: **Muhammad Shayan**. Role: **Kotlin Multiplatform Developer**.
- Location: **Islamabad** (owner's decision for the portfolio; keep it everywhere on the site).
- Email `hello@shayxo.dev` · GitHub `github.com/shayann07` · LinkedIn `linkedin.com/in/shayann07`.
- Headline numbers: **8 apps on Google Play**, **70K+ installs** (owner's figure, use as given). InvoiceOne is **not** on Google Play yet ("Coming soon"), so it is not counted. Vitals and Upscaly mobile are in closed testing and are counted (owner's decision).
  Do not show per-app install counts except the two verified below.

### Experience (matches the CV; newest first)
| Dates | Role | Org | Note |
|---|---|---|---|
| May 2026 — Now | Kotlin Multiplatform Developer | Webscare · Sargodha | Cross-platform apps with Compose Multiplatform and MVI across 50+ shared modules. Shipped 4 apps on Google Play, including Urdu Speech to Text and Speedometer GO, through CI/CD releases. |
| Sep 2025 — Mar 2026 | Android Developer | TudoNum · Portugal | Built an on-demand services marketplace with 50+ screens: booking, provider bidding, in-app chat, payments. Integrated REST APIs with secure sign-in and offline caching. |
| Jun 2024 — Now | Freelance Android Developer | Self-employed | Delivered 3 production apps with 10K+ installs using offline-first sync, Firebase, Room and stable release workflows. Built LUP Reader, a reading aid for low-vision users in Spain that reads text aloud in 6 languages. |
| May — Aug 2025 | Android Developer Intern | Appverse Technologies · Lahore | Built Android modules on MVVM and improved stability through refactoring and unit testing. |
| 2022 — 2026 | BS Software Engineering | University of Sargodha | (no note) |

(Order is intentional: current roles first, internship last.)

### Stack list (replace `STACK` in `src/routes/index.tsx`)
`Kotlin Multiplatform, Kotlin, Compose Multiplatform, Jetpack Compose, Coroutines, Flow, Ktor,
SQLDelight, Koin, Clean Architecture, MVI, Firebase, Gradle, Git, CI/CD`
Remove: Flutter, TypeScript, Node.js, Express, Cloud Functions, PostgreSQL, GraphQL, Stripe,
PyTorch Mobile, TensorFlow Lite, MediaPipe, Docker, Media3. (Room may stay if the list has room.)

### The projects that stay (Selected Work, in this exact order)
| # | Title | Year | Tag | Badge | Link type + URL |
|---|---|---|---|---|---|
| 1 | **UrduCanvas** | **2025** | Design editor · Kotlin Multiplatform | `10K+ installs` | store · https://play.google.com/store/apps/details?id=com.webscare.urducanvas&hl=en-US |
| 2 | **InvoiceOne** | 2026 | Multiplatform · Kotlin | `50+ modules` | **Coming soon**: not on Google Play yet and no URL exists. Use `link: "soon"`: the card is **not a link** (no `href`, no `target`), the CTA reads "Coming soon", and the aria-label says it is not yet released. When a Play URL exists, switch to `store`. |
| 3 | **liquidglass** | 2026 | Open source · Compose Multiplatform | `Maven Central` | source · https://github.com/shayann07/liquidglass (docs: https://shayann07.github.io/liquidglass/) |
| 4 | **Upscaly** | 2026 | Desktop + Android · Real-ESRGAN | `Local GPU` | site · https://upscaly.shayxo.dev (GitHub: https://github.com/shayann07/Upscaly) |
| 5 | **Urdu Speech to Text** | **OWNER** (default 2025) | Voice · Android | `10K+ installs` | store · https://play.google.com/store/apps/details?id=com.webscare.urduspeechtotext&hl=en-US |
| 6 | **Medly** | 2026 | HealthTech · Android | `RxNorm` | store · https://play.google.com/store/apps/details?id=com.medly.reminder&hl=en-US |

Descriptions (use these; keep them to the existing 2–3 line length):
1. **UrduCanvas** — "Urdu text-on-photo design editor drawn entirely on Canvas. Right-to-left typing with Kasheeda, layers, gradients and brushes, a template library, and one-tap background removal."
2. **InvoiceOne** — "Local-first invoicing on a Kotlin Multiplatform base: one codebase across Android, iOS, desktop and web, 50+ Gradle modules, every feature split api/impl behind an MVI shell."
3. **liquidglass** — "Liquid Glass for Compose Multiplatform. Real refraction, dispersion and rim lighting in one shader, applied with a single modifier. Android (AGSL) and desktop (Skia), published on Maven Central with docs."
4. **Upscaly** — "Free, offline AI image and video upscaling on your own GPU. Real-ESRGAN, batch queues and a VRAM governor that keeps the machine alive. Nothing is uploaded; an Android port runs the same models on ncnn and Vulkan."
5. **Urdu Speech to Text** — "Voice transcription for Urdu, live on Google Play with 10K+ installs." (**OWNER**: send a richer description if wanted; do not invent features.)
6. **Medly** — keep the current description in `WORK` (Gemini prescription scan, RxNorm verification, two-stage alarms, history in Room).

**Remove entirely** (data, glyph, diorama scene, CSS, JSON-LD entry, tests/baselines that reference
them): LeafBloom, StreamBox, Medicare, GitPulse.
Not on the site (owner decision): EyeIQ, Speedometer GO, Vitals (closed testing).

### Verified live stats you may show
- UrduCanvas: 10K+ installs (Google Play). Urdu Speech to Text: 10K+ installs.
- liquidglass: Apache-2.0, on Maven Central as `dev.shayxo.liquidglass:liquidglass`.
- Do **not** show Medly install counts (100+) or any rating.

---

## 3. Task 1 — Copy and facts (`src/routes/index.tsx`, `src/routes/__root.tsx`)

1. **Hero lede** (replace the paragraph around line 403):
   "Kotlin Multiplatform developer shipping apps that share one codebase across Android, iOS,
   desktop and web. 8 apps on Google Play with 70K+ installs, plus open-source work in the Kotlin
   ecosystem. Based in Islamabad, shipping worldwide."
   Keep the `whole systems, not just screens` highlight span only if it still reads naturally;
   otherwise drop it. Keep the Start a Project / See Work / CV buttons.
2. **`PROOF` strip** (4 chips, each links to the project that proves it):
   - Kotlin Multiplatform · "One codebase, 4 targets" → `#w-invoiceone`
   - Shipped apps · "8 on Google Play · 70K+ installs" → `#w-urducanvas`
   - Open source · "Merged in OkHttp, Arrow, Molecule, Haze" → `#open-source`
   - Graphics · "Shader-based Compose UI" → `#w-liquidglass`
   Pick icons from the existing `AnimatedIcon` set (`orbit`, `layers`, `chip`, `wave`, `bolt`, `gear`
   already used); do not add a new icon set.
3. **About** section: rewrite the two paragraphs so they match KMP positioning. Keep the first
   sentence idea ("I started on Android and did not stop there"), then: Kotlin Multiplatform
   clients on Compose Multiplatform, local-first storage, modules that do not reach into each
   other, screens that are pure functions of state; lately a 50+ module build, shader work in
   liquidglass, and contributions to libraries other people depend on. Keep "Sharpened at
   Appverse Technologies, on top of a BS in Software Engineering from the University of
   Sargodha." Replace the "Daily runtime" list items with: Kotlin Multiplatform · Compose
   Multiplatform · Ktor & SQLDelight. Remove "Node & Firebase" and "On-device ML".
4. **`STORY`** → the experience table in section 2 (5 rows incl. education). Keep the `current` flags
   for the two ongoing roles.
5. **`STACK`** → the list in section 2.
6. **`WORK`** → the six projects in section 2 (ids `w-urducanvas`, `w-invoiceone`, `w-liquidglass`,
   `w-upscaly`, `w-urduspeech`, `w-medly`). Add two values to the `link` union in
   `SpatialWork.tsx`: `"site"` (CTA label "Website", icon `arrow`, opens in a new tab) for Upscaly, and
   `"soon"` (CTA label "Coming soon", no link) for InvoiceOne. A `"soon"` card must render as a
   non-interactive element (e.g. a `div` with `role="group"`), not an `<a>`, and must not show the
   "Private · ask me" text. Remove the old `contact` value if nothing else uses it.
7. **CV button**: replace `public/muhammad_shayan_cv.pdf` with the new CV (see task 6) and keep
   `CV_URL` pointing at it.
8. **`__root.tsx` metadata**: update `PROJECT_SCHEMA` to the six projects only (it must mirror
   `WORK`); `jobTitle: "Kotlin Multiplatform Developer"`; `knowsAbout`: Kotlin Multiplatform,
   Compose Multiplatform, Kotlin, Jetpack Compose, Ktor, SQLDelight, Coroutines, Open source;
   remove Flutter, Node.js, Firebase, "On-device machine learning", "Payment integration". Update
   the site `<title>`, `og:*` and `description` in `index.tsx` `head()` to "Muhammad Shayan —
   Kotlin Multiplatform Developer". Keep `addressLocality: "Islamabad"`.
9. **Contact** section copy: keep; only change anything that mentions Android/Flutter/ML.
10. Search the whole `src/` for leftover `Flutter`, `LeafBloom`, `StreamBox`, `Medicare`, `GitPulse`,
    `MLM`, `34 modules`; none may remain.

## 4. Task 2 — Project glyphs and dioramas (`ProjectMark.tsx`, `SpatialWork.tsx`, `styles.css`)

Each project has a glyph (`PROJECT_MARKS`) and a diorama keyed by the same name.
- Remove marks/scenes/CSS for `leafbloom`, `streambox`, `medicare`, `gitpulse`.
- Keep `medly`, `invoiceone`, `upscaly` as they are.
- Add three new marks **in the same style** (24px grid, 1.6 stroke, round caps/joins, exactly one
  crimson accent, body strokes use `currentColor`):
  - `urducanvas`: a canvas/frame with a calligraphic stroke (one accent curve for the Kasheeda).
  - `liquidglass`: a droplet or lens with a refraction arc (accent on the arc).
  - `urduspeech`: a mic or waveform with a script-like glyph (accent on the waveform).
- Add three dioramas in `WorkScene`, using only existing primitives (`wplane`, `wrow`, `wtag`,
  perspective floor/shadow/glow): layered canvas planes with a moving stroke; a glass pane over a
  gradient plane; a waveform plane. Look at how `invoiceone` and `upscaly` are built and at the
  matching rules in `src/styles.css`; the new scenes must feel like siblings, not new styles.
- `tests/visual-baselines` and `tests/scroll-baselines` may reference removed items. Regenerate with
  `npm run test:visual:update` (needs Python) only after the visuals are final; mention it in
  your report if you could not run it.

## 5. Task 3 — Open Source section, fetched live from GitHub (NEW)

### What it shows
A new section **between Selected Work and Lab**: eyebrow `04 / Open Source`, heading e.g.
"Contributing upstream." Each card: repo name, star count, PR title (trimmed), PR number linking to
the PR, merged date. Top line under the heading shows live counts: "N merged · M in review".
Lab becomes `05`, Contact `06`.
Update `SpatialNav.tsx`, `useSectionNav.ts` and any section-number eyebrows so the nav has the new
item (`Open Source`) without breaking scroll-spy. If six items crowd the pill nav on mobile, label it
`OSS` there.

### Data must be fetched fresh, not hard-coded
- **Source:** GitHub, for user `shayann07`, **merged** pull requests to repositories that are
  **not** owned by `shayann07` and **not** company repos. Exclude owners: `shayann07`, `webscarepk`,
  `SumaibH` (put these in one constant `OSS_EXCLUDE_OWNERS`).
- **Query (GraphQL, one request):**
  ```
  search(type: ISSUE, first: 30,
    query: "is:pr is:merged author:shayann07 -user:shayann07 -user:webscarepk -user:SumaibH sort:updated-desc") {
    nodes { ... on PullRequest { number title url mergedAt
      repository { nameWithOwner url stargazerCount } } } }
  ```
  A second small query (or the `issueCount` of a search) gives the count of **open** PRs with the
  same exclusions for the "in review" figure. Rank cards by repository `stargazerCount` descending,
  then `mergedAt`; show the top **6** (today there are exactly 4, which is fine). If more than 6,
  keep the top 6 by stars.
- **Where it runs:** a TanStack Start **server function** (`createServerFn`) called from the route
  loader, so the data is in the server-rendered HTML (good for SEO) and the token never reaches the
  browser. Put it in `src/server/open-source.ts` (new) and types in `src/lib/open-source.ts`.
- **Auth:** read `process.env.GITHUB_TOKEN` on the server (a fine-grained, read-only, public-data
  token). GraphQL requires a token. **Without a token or on any failure, fall back** (below).
  Never log or return the token. Add `GITHUB_TOKEN=` (empty) to a new `.env.example`; add `.env*` to
  `.gitignore` if it is not already ignored. The deploy target is defined by
  `@lovable.dev/vite-tanstack-config` (nitro, Cloudflare by default): check how env vars are bound in
  that setup and note in your report exactly where the owner must add `GITHUB_TOKEN`.
- **Freshness / caching:** cache the result for **1 hour** (in-memory TTL in the server function plus
  `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` on the response where the
  platform allows). Serve stale on error. The card list should visibly say when it was last fetched
  ("Updated 12 min ago", computed from a `fetchedAt` ISO timestamp the server returns).
- **Fallback snapshot:** commit `src/data/open-source.snapshot.json` containing the four verified
  merged PRs below, used when the live fetch fails or no token is set. In that case render the
  snapshot **without** the "live" styling and without an "Updated … ago" claim, and keep the
  "in review" count hidden. Never show an empty or broken section: if there is neither live data nor
  snapshot, hide the section and its nav item.
- **UX states:** server-rendered content on first paint (no spinner flash). If you also add a
  client refresh, it must be silent and never replace good data with an error.
- **Rate-limit and error handling:** handle 401/403/5xx/network errors and GraphQL `errors`;
  fall back; do not retry in a tight loop.
- **Tests (vitest):** unit-test the mapping (GraphQL response → card model), the exclusion list,
  the top-N ranking, the "x minutes ago" formatter, and the fallback path (fetch rejects → snapshot).
  Mock `fetch`; do not call GitHub in tests.

### Snapshot contents (verified on GitHub, all merged)
| Repo | Stars (at check) | PR | Title | Merged |
|---|---|---|---|---|
| lysine-dev/okhttp | ~47K | #9776 https://github.com/lysine-dev/okhttp/pull/9776 | Wrap HTTP resolution errors in UnknownHostException in DnsOverHttps | 2026-10-02 |
| arrow-kt/arrow | ~6.5K | #3977 https://github.com/arrow-kt/arrow/pull/3977 | Pass optional accumulated value to recovery handler in Ior | 2026-10-03 |
| chrisbanes/haze | ~2.6K | #1387 https://github.com/chrisbanes/haze/pull/1387 | Provide Desktop window identity via LocalAwtWindow | 2026-10-02 |
| cashapp/molecule | ~2.2K | #796 https://github.com/cashapp/molecule/pull/796 | Add NodeJsFrameClock for Kotlin/JS Node.js runtime | 2026-10-02 |

At the last check there were also **29 open** PRs across other repos (Koin, Detekt, KSP, Kotest,
Paparazzi, Roborazzi, LeakCanary, Okio, Lottie, kotlinx.serialization and more). The live "in
review" figure replaces this number; do not hard-code it.

### JSON-LD
Do **not** add the Open Source cards to `PROJECT_SCHEMA` (they are contributions, not projects).

## 6. Task 4 — Lab section (`LAB`, `LabScene.tsx`)

The three current Lab cards (Settlement Engine, Deposit Rails, Graph Aggregator) describe fintech/MLM
payout backends and do not support the KMP positioning. Replace them:

1. **Billing & sync backend (InvoiceOne)** — scene `rails` reused or retitled. Status `Live`.
   Note: "The Laravel service behind InvoiceOne: Google Play subscription billing that acknowledges
   purchases and survives renewal and refund edge cases, delta sync that pulls a device's state in a
   fixed number of queries, and PDF generation for invoices, receipts and statements."
2. **Multi-module architecture** — scene `graph`. Status `50+ modules`. Note: "A Gradle convention
   plugin per module type, feature modules split into api and impl so no feature reaches into
   another's internals, and one composition root. Boring where it counts, so changes stay local."
3. **Shaders in Compose (liquidglass)** — scene `settlement` reused. Status `Maven Central`. Note:
   "One AGSL/SkSL shader doing refraction, dispersion and rim lighting, fitted to measurements from
   real captures rather than tuned by eye, with a graceful fallback below Android 13."

**Privacy:** the backend repo is private and belongs to Webscare. Describe behaviour at the level
above only. No repository names, no code, no endpoints, no customer data, no secrets. **OWNER**: if
they prefer not to publish the backend card, replace it with a second liquidglass/architecture card
and say so in the report.
Keep the existing scene components; only rename props/labels. Update the Lab heading copy if it
mentions fintech. Remove the `673 lines of payout logic` sentence everywhere.

## 7. Task 5 — Visual polish

1. The empty vertical gap between the end of **Path** and the heading of **Selected Work** looks
   unfinished: reduce it to the standard section spacing used between About and Path.
2. Body text contrast in About and Path is dim grey on near-black: raise the body text token (or the
   specific `.body-md` colour in those sections) to meet **WCAG AA, 4.5:1** against the background.
   Do not change heading colours or the overall palette.
3. Hero: the lede and buttons are revealed with `Reveal` delays (0.6s, 0.75s). Confirm they are
   visible without scrolling at 1440×900 and 390×844 and that `prefers-reduced-motion` shows them
   immediately.
4. Check the Open Source cards and new Work cards at 390px, 768px and 1440px: no horizontal scroll,
   no clipped text, tap targets at least 44px.

## 8. Task 6 — Assets

1. Copy `D:\Work\Certifications\Muhammad-Shayan-Nawaz-KMP-Developer-CV.pdf` over
   `public/muhammad_shayan_cv.pdf` (keep the filename so `CV_URL` and any external links keep
   working).
2. Regenerate the social image so it no longer mentions Android/Flutter: update the text in
   `scripts/generate-og.mjs` to "Kotlin Multiplatform Developer", run `npm run og`, check
   `public/og-image.png`.
3. `public/sitemap.xml` and `robots.txt`: leave as they are unless a URL changed.

---

## 9. Acceptance checklist (run all; paste results in your final report)

- [ ] `npm run lint`, `npm run test`, `npm run build` all pass.
- [ ] `npm run dev`: page loads with no console errors or hydration warnings.
- [ ] Grep finds none of: `Flutter`, `LeafBloom`, `StreamBox`, `Medicare`, `GitPulse`, `MLM`,
      `34 modules`, `673 lines` in `src/` or `public/` (except inside the old CV pdf).
- [ ] Selected Work shows exactly six cards in the section 2 order, UrduCanvas first, year 2025.
- [ ] Every external link opens the right page (5 work links, 4 PR links, liquidglass docs). The InvoiceOne card is not clickable and says "Coming soon".
- [ ] Open Source section: with a valid `GITHUB_TOKEN` it shows live data and "Updated … ago";
      with the token unset it shows the snapshot and no live claim; with network blocked it still
      renders. Take a screenshot of each state.
- [ ] Merge a hypothetical change: temporarily point the query at another user in dev to prove the
      section really is data-driven (then revert).
- [ ] `view-source` of the page contains the Open Source cards (server-rendered).
- [ ] The token string does not appear in the client bundle (`grep` the `dist` client assets).
- [ ] Nav scroll-spy highlights Open Source when it is on screen; mobile nav still fits.
- [ ] Lighthouse (desktop): Accessibility ≥ 95, SEO ≥ 95; no new a11y violations on new cards.
- [ ] Location reads Islamabad on the whole site, including the JSON-LD and footer.
- [ ] CV button downloads the new KMP CV.

## 10. Final report format

Reply with: (1) a per-task summary of what changed, file by file; (2) results of every checklist
line; (3) the list of **OWNER** items you defaulted: Urdu Speech to Text
year and description, whether the private backend card should be published, and where to set
`GITHUB_TOKEN`; (4) screenshots of the hero, Selected Work, Open Source (live and fallback states)
and Lab at 1440px and 390px.

## 11. Out of scope

Redesigning the site, changing the shader/cursor/nav behaviour, adding a CMS or blog, adding
analytics, changing the Contact form behaviour, touching `brand/`, editing the owner's CV
(handled separately), and publishing anything or pushing to the remote. Commit locally only.
