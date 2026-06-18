# AgentHub — marketing site

The promo landing page for **AgentHub**, the local-first mission control for Jira tickets and
AI coding agents. Pure static site — **no build step, no dependencies, no framework**. Just open it.

## Files

```
index.html      # the landing page (semantic sections + an inline SVG icon sprite)
changelog.html  # the changelog page (shares styles.css + app.js)
styles.css      # dark "Linear-style" theme — indigo→violet, hairline borders, responsive
app.js          # sticky-nav state, mobile menu, scroll-reveal, copy-to-clipboard, footer year
assets/
  favicon.svg   # the AgentHub "boxes" glyph on the brand gradient
  og.svg        # 1200×630 Open Graph / social preview image
```

Fonts (Geist + Geist Mono) load from Google Fonts to match the AgentHub app; a system-font
fallback is in place if you're offline.

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

## Notes

- The `git clone …` URL in the "Get started" terminal is a placeholder — swap in the real repo URL
  once AgentHub has a public (or internal) remote.
- For the richest social previews, some scrapers prefer a raster image. If you need one, export
  `assets/og.svg` to a 1200×630 PNG and update the `og:image` / `twitter:image` tags.
