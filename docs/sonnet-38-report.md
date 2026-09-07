# Sonnet-38 report — site pass 2: from "khá ổn" to memorable

Branch: `v1-site` (continued, not pushed). Working dir:
`/Users/vietvk/Projects/VietVK/AgentHub-website`. Built on top of `docs/sonnet-35-report.md`'s
rebuild — nothing from pass 1 was reverted, only extended.

## What shipped, against the brief's five items

**1. Hero loop.** Never touched the owner's daemon beyond two read-only `GET`s for the stat line
(below) — no composer typing, no session started. Instead: stitched 5 real screenshots per theme into
a silent 8.6s crossfade slideshow with `ffmpeg` (`xfade` filter, true dissolve between frames, not a
fade-to-black — my first pass used per-clip fade in/out and produced a visible black flash at every
cut, caught in my own proof screenshot and rebuilt with `xfade` before shipping). Light sequence:
`turn-summary-app-light → build54-tasks-light → notes-board-light → picker-ratings-app-light →
plan-spacing-app-light`; dark sequence uses the dark variant of each shot that has one and reuses the
light one for the two that don't (`notes-board`, `plan-spacing-app`), same convention pass 1 used.
Output: `assets/hero-loop-{light,dark}.{mp4,webm}` (264–420 KB mp4, 630–730 KB webm), no separate
poster file — `turn-summary-app-{light,dark}.png` (already in `assets/`) is reused directly as the
`<video poster>` and as a same-theme `<img class="hero-poster">`. The hero markup ships both an
`<img>` and a `<video>`; CSS hides the `<video>` by default and only reveals it once `app.js` adds
`.js-video` to `.hero-visual` — and it skips that entirely when
`matchMedia('(prefers-reduced-motion: reduce)').matches`. A `prefers-reduced-motion: reduce` media
query in `styles.css` also force-hides the video and force-shows the poster as a second, CSS-only
guarantee independent of JS running correctly.

**2. Storyboard.** New `#how` section between the hero and `#free`: three `.story-step` cards (Notes
→ Execute → Merge), each fully visible and readable with no JS at all — nothing is hidden pending a
scroll trigger, learning from pass 1's own postmortem about `IntersectionObserver` never firing on a
`fullPage` Playwright capture. `app.js` adds an `IntersectionObserver` that only adds a decorative
`.active` class (accent border + gradient step-number) as each card enters the viewport in a real
browser; it degrades to a plain 3-up static list with no JS, and the site-wide
`prefers-reduced-motion` rule already zeroes the CSS transition, so the "light-up" never animates for
a reduced-motion visitor — it just appears.

**3. Comparison table.** New `#compare` section, six rows (free lane without a key, worktree per
session, built-in workflow templates, automatic failover, runs locally, price) × AgentHub + the four
named competitors, every cell read from
`/Users/vietvk/Projects/VietVK/AgentHub/docs/research/2026-09-07-field-study/A-orchestrator-apps.md`
(never linked or named on the live page, per the source-path rule) — `—` where that doc didn't state
a fact rather than guessing (e.g. vibe-kanban's "free lane, no key" row, or whether Conductor/vibe-
kanban/Cursor/Codex ship built-in workflow templates or automatic failover — none of the four
sources said either way). AgentHub's own row is marked with a `★` (CSS `content` on `.us` cells, not
a guess — it's the product's own shipped behavior). Wrapped in a horizontally-scrolling container
(`.compare-scroll`) so the 7-column table never causes page-level overflow on mobile — confirmed 0px
`scrollWidth` overflow at 390px on all three pages after adding it.

**4. Dark default + system light.** Swapped `styles.css`'s `:root` token block: the former
`@media (prefers-color-scheme: dark)` values are now the bare `:root` (unconditional) default, and
the former default light values moved under a new `@media (prefers-color-scheme: light)` block —
same two palettes, opposite default, so a user agent that doesn't evaluate `prefers-color-scheme` at
all (or reports neither) now gets dark, not light. The existing `.shot-light`/`.shot-dark`
light/dark-screenshot-pair mechanism flips for free from this one change (dark shot shows by default
site-wide, light shot under the light media query) — didn't have to touch any of the ~14 image pairs
individually. Added an unconditional `<meta name="theme-color" content="#0a0912">` ahead of the two
existing conditional ones on all three pages, for the same "no media-query support" fallback case.

**5. Real numbers in the hero.** `95 free models · 5 workflows · 6 skills`, each independently
checked, not carried over from the brief's example text:
- **95 free models** — `curl -s http://127.0.0.1:4600/api/models/sources` (the one non-`/api/health`
  call I made to the owner's running daemon; read-only `GET`, nothing sent) → `.free.total` = 95.
  Confirmed this is the exact field the app itself uses for this count:
  `ui/src/deck/pages/models.tsx:410` computes its own "N more models" button off
  `data?.free.total ?? 0`, so the number on the site now matches what the app would show, not a
  number I invented from filtering the list myself.
- **5 workflows** — Review/Build/Fix/Test/Release, already named in the `#workflows` section from
  pass 1.
- **6 skills** — `ls -d runtime/skills/*/` in the AgentHub repo → 6 directories
  (`code-review-and-quality`, `diagnosing-bugs`, `performance-optimization`, `terse`,
  `ui-ux-pro-max`, `writing-plans`), matching the six pills already listed in `#skills`.

Shown as three `.star-chip` pills under the hero meta line, reused as a visual/motion element (see
micro-motion below), not just plain text.

## Micro-motion (also requested, folded in)

- **Card hover lift**: `.frame` (screenshot frames) and `.pill` (skill pills) now `translateY(-3px to
  -4px)` + deepen their shadow + tint their border on hover; `.wf-chip` (workflow chips) get a
  smaller `-2px` lift. All via `transform`/`box-shadow`/`border-color` transitions, so
  `prefers-reduced-motion`'s site-wide `transition-duration: .001ms !important` already neutralizes
  them for anyone who's asked for less motion — no separate guard needed.
- **Glass nav**: `.nav` background went from `color-mix(...86%...)` + `blur(10px)` to
  `color-mix(...70%...)` + `blur(14px) saturate(1.4)` (more translucent, more blurred, slightly
  saturated) pre-scroll, sharpening to `88%` opaque once `.scrolled` — reads more like a real glass
  panel over the background grid, less like a solid bar with a hairline.
- **★ chips**: new `.star-chip` component (star-prefixed pill, accent-tinted background/border) —
  used for the hero's three real-number stats and once more inline in the Compare section's intro
  line to mark the "AgentHub" column. Lifts and scales slightly on hover.

## Typography

`h1`/`h2`/`h3`/`h4` base letter-spacing tightened from `-0.02em` to `-0.024em`, line-height `1.1` →
`1.06`. Section headings (`.section-head h2`, `.feature-text h2`, `.cta-band h2`, `.page-head h1`,
the hero `h1` itself) now set `font-family: var(--font-display)` (Instrument Serif) at weight 500 and
bumped sizes — e.g. hero `clamp(34px,5.4vw,56px)` → `clamp(38px,6.2vw,64px)`, section heads
`clamp(26px,3.4vw,38px)` → `clamp(30px,3.9vw,44px)`. Previously only the hero's `.grad-text` span
("free to run.") was serif; every major heading on the site is serif now, which is also why the
hero's own italic gradient span still reads as an accent rather than a mismatched font swap.

## Verification (real commands, real output)

- **Local preview**: `python3 -m http.server 5071` from the site root, killed after every check pass
  (`lsof -ti tcp:5071 | xargs kill` — confirmed empty afterward). No server left running.
- **Playwright** (same `playwright-core` install pass 1 used, from
  `AgentHub/ui/node_modules/playwright-core`, Chromium already cached): scripted checks across
  `index.html`, `changelog.html`, `plan/index.html` × light/dark, plus 390×844 mobile × light/dark for
  all three pages —
  - `h1Count === 1` on every page/theme (6/6).
  - Zero `<img>` missing `alt` on every page/theme.
  - Zero console errors, zero page errors, on every page/theme.
  - `document.documentElement.scrollWidth - clientWidth === 0` at both 1280px and 390px on every
    page (no horizontal overflow — the new 7-column compare table's `.compare-scroll` wrapper is why
    it doesn't blow out mobile width).
  - `prefers-reduced-motion: reduce` context: hero `<video>` computed `display: none`, poster `<img>`
    computed `display !== none` — confirmed true.
  - Motion-allowed dark context: dark `<video>` visible, dark poster hidden, light `<video>` hidden —
    confirmed true (and the light-context mirror, checked separately).
  - Storyboard: scrolled `#how` into view, waited 600ms, counted `.story-step.active` — 3 of 3 lit
    (all three sit in one viewport-height row at 1280px, so they cross the 0.4 threshold together;
    the mechanism firing is what I verified, not staggered timing).
- **Screenshots**: 12 proof PNGs in `docs/` — `{home,changelog,plan}-1280x800-{light,dark}.png` and
  `{home,changelog,plan}-390x844-{light,dark}.png` — largest is 255,708 bytes (`home-1280x800-light`),
  all ≤300 KB, checked with `find docs -maxdepth 1 -name "*.png" -size +300k` (empty result both
  times I ran it, including after the final asset cleanup below).
- **Asset link check**: grepped every `assets/*.{png,svg,webm,mp4}` reference across all three HTML
  files and confirmed each file exists on disk; separately diffed `ls assets/` against the same
  reference list to find and remove dead files (see Cleanup).
- **Copy compliance**: `grep -ni "omniroute\|\bpi\b"` across every HTML/CSS/JS/README file in the
  repo → no hits. `grep -ni` for internal absolute paths, the AgentHub repo's doc/crate paths, and
  the two internal doc names I sourced from (`qa-loop-1-design`, `field-study`) → no hits anywhere in
  shipped copy.
- **Cache-busting**: bumped `styles.css?v=1`→`?v=2` and `app.js?v=1`→`?v=2` on all three pages per
  the README's own instruction (GitHub Pages caches these for 10 minutes; both files changed
  substantially this pass).

## Bug I found and fixed before it shipped

First hero-loop build used ffmpeg's `fade=t=in`/`fade=t=out` on each clip independently, concatenated
with the `concat` demuxer — visually this produces a hard cut through black between every pair of
images, not a crossfade. My own debug screenshot (`video.currentTime` frozen mid-transition) caught a
solid black frame where a screenshot should be — looked like a broken/unloaded video at first glance,
but `video.readyState === 4` and `currentTime` was advancing normally, so it was actually mid-fade-to-
black by design, not a load failure. Rebuilt with `xfade` (true pixel-blend crossfade between
consecutive inputs, offset-chained across all 5 frames) — re-screenshotted at the same relative
timestamp and got a clean in-progress dissolve between two real screens, no black.

## Scope calls

- **No live daemon recording.** The brief explicitly ruled out typing into the composer against the
  owner's daemon, and offered the stitched-screenshot fallback as the primary path, not a last
  resort — used that path directly rather than attempting a Playwright *video-recording* session
  against `127.0.0.1:4600` (which the "never send anything to the daemon beyond read-only GETs" rule
  would have blocked anyway, since driving the UI to walk through a sequence isn't a GET).
- **Comparison table has no AgentHub-vs-nothing row for "built-in workflow templates" or "automatic
  failover" beyond AgentHub's own row** — none of the four sourced write-ups stated whether Conductor,
  vibe-kanban, Cursor or Codex have an equivalent, so those 8 cells are `—`, not "No". Marking them
  "No" would have been a guess the brief explicitly forbade.
- **Storyboard sits between the hero and `#free`**, not appended at the bottom — it's a "how the whole
  loop works" explainer, so it reads better right after the pitch and before the section-by-section
  walkthrough starts. Removed the old `#free { padding-top: 200px }` hack from `styles.css` at
  ≥900px width, since that spacing existed only to stop the hero's screenshot and `#free`'s
  screenshot from visually merging when they were adjacent sections — they're no longer adjacent now
  that `#how` sits between them.
- **Didn't add a manual light/dark toggle.** The brief said "dark default + system light" (singular
  system-driven behavior), matching the existing site's design (no toggle in pass 1 either) — kept it
  System-only, just flipped which side is the fallback.

## Cleanup

- Removed `assets/hero-loop-poster-{light,dark}.png` after confirming via `cmp` they were
  byte-identical to `assets/turn-summary-app-{light,dark}.png` (I'd copied them for the poster before
  realizing the source screenshot already served that exact purpose) — repointed every `poster=`/
  `<img class="hero-poster">` reference at the existing file instead of shipping a duplicate.
- Removed `assets/build54-tasks-{light,dark}.png` and `assets/notes-board-light.png` after they were
  baked into `hero-loop-{light,dark}.{mp4,webm}` — nothing in the shipped HTML references them
  directly (they're source frames for the video, not standalone site imagery), so keeping them in
  `assets/` would've been dead weight.
- No servers left running (`lsof -ti tcp:5071` empty after the final check pass).
- All scratch Playwright/ffmpeg scripts and intermediate video files lived in this session's
  scratchpad directory and were deleted at the end; nothing left in `/tmp` or scattered in the repo.
- `.env` was not read or touched (doesn't exist in this repo).
- Nothing pushed, nothing merged, nothing deployed.

## Commits on `v1-site` (this pass)

1. `site: pass 2 — hero loop, storyboard, comparison, dark default` — `index.html`, `styles.css`,
   `app.js`, `README.md`, `assets/hero-loop-{light,dark}.{mp4,webm}`, plus the removal of the three
   dead PNGs listed above.
2. `docs: sonnet-38 report + refreshed proof` — this file + the 12 proof screenshots in `docs/`
   (8 re-captured to reflect the new design, 4 new mobile-dark/light pairs added for changelog and
   plan that pass 1 didn't have).

## What I did not do

- Did not verify the "95 free models" number will still read 95 by the time this ships — it's a live
  count from the gateway's catalog at the moment I checked
  (`GET /api/models/sources` → `.free.total`), baked into the static HTML as of this session, not
  fetched live by the browser (the brief's "count... at build time" reading, and the only sane one
  for a static site that must never call the owner's daemon from a visitor's browser). If that number
  drifts meaningfully before v1.0 ships, it needs a manual re-check and re-bake, not an automated one
  — there's no build step in this repo to hang that on.
- Did not run an actual Lighthouse audit (no `lighthouse` CLI in this environment, same gap pass 1
  hit) — substituted the same Playwright-based "basics" pass 1 used (console/page errors, single h1,
  alt coverage, zero overflow).
