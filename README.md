# AgentHub — marketing site

The promo site for **AgentHub**: a free coding agent that runs on your Mac — no API key, a git
worktree per session, a task board that finds work in your repo, five workflow templates with
automatic failover, skills, and custom agents. Pure static site — **no build step, no dependencies,
no framework**. Just open it.

## Files

```
index.html      # the landing page (8 feature sections + hero, semantic + an inline SVG icon sprite)
changelog.html  # the changelog page (shares styles.css + app.js)
plan/index.html # Free vs Plan detail page (ceilings table, proposed price, FAQ)
styles.css      # theme lifted from the app's own design/studio/app/globals.css tokens; light is the
                # base palette, dark overrides under prefers-color-scheme — same two themes as the app
app.js          # sticky-nav border, mobile menu, footer year — that's all of it
assets/
  favicon.svg   # the AgentHub "boxes" glyph on the brand gradient
  og.svg        # 1200×630 Open Graph / social preview image
  build53-*.png, tasks-*.png, picker-ratings-app-*.png, plan-spacing-app-*.png,
  terminal-padding-after-*.png, turn-summary-app-*.png
                # real screenshots of the installed app, reused as site imagery (each ≤300 KB)
docs/           # Playwright proof screenshots + this session's report (not published, just proof)
```

Fonts (Geist, JetBrains Mono, Instrument Serif — the same three the app uses, per
`design/studio/app/layout.tsx`) load from Google Fonts; a system-font fallback is in place if
you're offline.

## Preview locally

It's just static files, so any of these work:

```bash
# Python (built into macOS)
python3 -m http.server 5050

# or Node
npx serve .

# or simply
open index.html
```

Then visit http://localhost:5050.

## Deploy

Drop the folder on any static host — there is nothing to compile.

- **GitHub Pages** — push to a repo, enable Pages on the branch root.
- **Netlify / Vercel / Cloudflare Pages** — point at this folder; leave the build command empty and
  set the publish/output directory to `.` (the repo root).
- **Any bucket/CDN** — upload `index.html`, `styles.css`, `app.js` and `assets/` as-is.

### Custom domain (e.g. agenthub.com)
Add the domain in your host's dashboard and point DNS at it (an `ALIAS`/`CNAME` for the apex or a
`CNAME` for `www`). No app changes needed.

## Editing

- **Copy & sections** live directly in `index.html` (each block is commented, e.g. `<!-- features -->`).
- **Colors / spacing / type** are CSS variables at the top of `styles.css` (`:root`).
- **Icons** are an inline `<svg>` sprite near the top of `index.html` (`<symbol id="i-…">`); reference
  one with `<svg><use href="#i-name"/></svg>`.

### ⚠️ Cache-busting (important)
GitHub Pages serves `styles.css` / `app.js` with `cache-control: max-age=600`, so browsers hold an
old copy after a deploy. The links use a version query — `styles.css?v=2`, `app.js?v=2` — so **every
time you edit `styles.css` or `app.js`, bump that number** (`?v=3`, `?v=4`, …) in **both** `index.html`
and `changelog.html`. That forces browsers to fetch the new file immediately. (A hard refresh —
`Cmd+Shift+R` — also works for testing.)

## Notes

- The Download button is a placeholder (`href="#download"`, reads "coming") and the Plan page's Buy
  button is a bare `href="#"` — both intentional until v1.0 actually ships and there's a real .dmg /
  payment flow. Don't wire them up early.
- For the richest social previews, some scrapers prefer a raster image. If you need one, export
  `assets/og.svg` to a 1200×630 PNG and update the `og:image` / `twitter:image` tags.
