# Brand fonts

Static TTFs fetched from Google Fonts, used **only at build time** by
`scripts/generate-og.mjs` to convert text runs to SVG outlines.

They are not served to visitors — the site loads its webfonts from
Google Fonts at runtime (see `src/routes/__root.tsx`).

| File | Family | Licence |
| --- | --- | --- |
| `Sora-ExtraBold.ttf` | Sora 800 | SIL Open Font License 1.1 |
| `Manrope-Medium.ttf` | Manrope 500 | SIL Open Font License 1.1 |
| `JetBrainsMono-Regular.ttf` | JetBrains Mono 400 | SIL Open Font License 1.1 |

Regenerate the card with `npm run og`.
