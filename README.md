# Muhammad Shayan: portfolio

Personal site of Muhammad Shayan, Kotlin Multiplatform developer: [shayxo.dev](https://shayxo.dev).

One page: intro, about, experience, selected work, open-source contributions, lab, contact.

## Stack

- TanStack Start (SSR), React 19, Vite
- Tailwind CSS v4 on a small token-based design system (`src/styles.css`)
- Framer Motion for the name reveal; the 3D panes and hover states are CSS

## Run it

```bash
npm install
npm run dev        # Vite prints the local address
npm run build
npm run test       # unit tests (open-source data layer)
npm run lint
```

## Open-source section (live data)

The "Contributing upstream" section lists merged pull requests to other people's repositories, fetched from the
GitHub GraphQL API on the server and cached for an hour. It needs a read-only token for public data:

```bash
cp .env.example .env     # then set GITHUB_TOKEN
```

Never prefix it with `VITE_`; it must stay on the server. Without a token, or if GitHub is unreachable, the
section falls back to the committed snapshot in `src/data/open-source.snapshot.json` and drops the "live" claims.

## Brand assets

Every icon and the social card are generated from the logo in `brand/logo/`:

```bash
node scripts/generate-icons.mjs   # favicons, app icons, logos, site.webmanifest
node scripts/generate-og.mjs      # public/og-image.png (1200x630)
```

## Deploy

The build detects Vercel and emits the Vercel output format automatically. Set `GITHUB_TOKEN` in the project's
environment variables (Production and Preview).

## License

MIT, see [LICENSE](LICENSE).
