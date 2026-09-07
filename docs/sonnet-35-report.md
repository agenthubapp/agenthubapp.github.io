# Sonnet-35 report — website rebuild for AgentHub V4 / v1.0-coming

Branch: `v1-site` (created from `main`, not pushed, not deployed). Working dir:
`/Users/vietvk/Projects/VietVK/AgentHub-website`.

## What shipped

1. **`site: rebuild for AgentHub v4 — free lane, worktrees, Notes, workflows, skills, Plan`**
   Full rewrite of `index.html`, `styles.css`, `app.js`, plus a new `plan/index.html` and an updated
   `README.md`. Every old claim (Jira tickets, Autopilot, five rooms, Cursor plan fallbacks, reviewed
   PRs) is gone.
2. **`site: changelog — v1.0 in progress`**
   `changelog.html`: kept every existing entry verbatim, added a top "v1.0 — Unreleased · building
   now" entry in the same voice, and updated its nav/footer to the new section names.
3. **`docs: sonnet-35 report + proof`**
   This file plus 8 Playwright screenshots in `docs/`.

## Sections written (home page, in the brief's order)

1. **Free, no key** (`#free`) — the free lane routes keyless models by health with automatic
   fallback; existing Claude Max / ChatGPT sign-ins become lanes.
2. **Worktrees** (`#worktrees`) — every session in its own git worktree from main; Changes / Diff /
   Terminal panel; Commit through a merge queue.
3. **Notes** (`#notes`) — the repo-scanning board (TODO/FIXME, `.agenthub/tasks/`, issues, failing
   tests, unfixed findings) plus typed notes; Run / Skip.
4. **Workflows** (`#workflows`) — Review, Build, Fix, Test, Release; quiet-line failover between
   lanes.
5. **Skills** (`#skills`) — the six bundled skills (UI/UX Pro Max, terse, diagnosing bugs, code
   review & quality, writing plans, performance optimization) with their real upstream credits, plus
   Add from GitHub.
6. **Custom agents** (`#agents`) — register any CLI.
7. **Plan** (`#plan`) — a short Free-vs-Plan summary + link to the new detail page.
8. **Local and private** (`#local`) — daemon + SQLite, keychain, no telemetry.

Plus a hero (one sentence + one line of difference + placeholder Download + a real screenshot) and a
closing download/CTA band.

## New Plan page (owner addendum)

`plan/index.html`: the full Free-vs-Plan ceilings table (6 rows, values read directly from
`crates/agenthubd/src/plan.rs`'s `FREE_LIMITS`/`PLAN_LIMITS`, not guessed), the proposed price
($39/1 Mac, $79/3 Macs, 12 months of updates, 7-day money back, no account), a "paste your key in
Settings › Plan" section with the real screenshot, a placeholder `Buy Plan — coming with v1.0`
button (bare `href="#"`, the only such link on the whole site besides the `#download` anchor), a real
`Watch releases on GitHub` link, and a 3-question FAQ. Linked from the home page's Plan section and
from the nav on every page.

## Every claim traced to a doc or a shipped screen

- Free lane / lanes-from-sign-ins: `docs/superpowers/specs/2026-09-04-agenthub-v4-works-out-of-the-box-design.md`
  §4.2–4.3; `docs/superpowers/specs/2026-09-07-outclass/00-overview.md` ("Nobody else ships free
  models with no key").
- Worktree-per-session, Changes/Diff/Terminal, merge queue: `docs/HANDOFF.md`; `docs/superpowers/specs/2026-09-06-workflows-design.md`
  §1 ("gathered onto the base branch and committed there... a per-base merge queue and
  `POST /api/workflows/{id}/commit`"); confirmed shipped via `crates/agenthubd/src/api.rs:1000` and
  `workflows::merge_queue::commit_and_merge`.
- Notes: `docs/superpowers/specs/2026-09-06-workflows-design.md`'s "Superseded by v2" header note
  (cards from TODO/FIXME, `.agenthub/tasks/*.md`, `gh` issues, failing verify, unfixed findings);
  real screens `assets/build53-tasks-fixed-{light,dark}.png`.
- Workflows (Review/Build/Fix/Test/Release + quiet-line failover): `docs/superpowers/specs/2026-09-06-workflows-design.md`
  §3 ("switched to Claude after Free hit its limit... no modal, no error code"); `docs/HANDOFF.md`'s
  shipped-today list; real screen `assets/tasks-result-app-light.png` (a Fix workflow's DONE card,
  "Ran on FREE").
- Skills: bundled set verified on disk (`runtime/skills/*/SKILL.md`, 6 folders) and their real
  upstream attributions read from each `SKILL.md`; "Add from GitHub" verified against
  `crates/agenthubd/src/api.rs:442` (`POST /api/skills/import`) and `ui/src/deck/pages/preferences.tsx`
  (the actual "Add from GitHub" row).
- Custom agents: `crates/agenthubd/src/custom_agents.rs` module doc ("register any CLI... it runs a
  session the same way claude/codex do... worktree, watchdog").
- Plan ceilings: `crates/agenthubd/src/plan.rs`'s `FREE_LIMITS`/`PLAN_LIMITS` constants, read
  directly, not from the design doc's older draft numbers.
- Price proposal: the owner's addendum message, verbatim ($39/$79, 12 months, 7-day money back, no
  account, key pasted in Settings › Plan).
- Local/private: `docs/HANDOFF.md` ("no cloud backend... local daemon"), and the literal on-screen
  copy in `assets/build53-models-*.png` ("Keys stay in the macOS keychain").

## What I deliberately left out / scope calls

- No screenshot for **Skills** or **Custom agents** sections — the brief's asset whitelist
  (`build53-*, build54-*, tasks-*, picker-ratings-app-*, plan-spacing-app-*,
  terminal-padding-after-*, turn-summary-app-*, motion-v3-*`) doesn't include a shot that shows
  either cleanly (`build51-skills.png` exists but isn't in the whitelist, and there's no custom-agent
  screen in the whitelist at all). I reused `build53-settings-*` a second time for Skills because it
  genuinely shows a "Skills: terse" row, and left Custom agents as text-only rather than reach for an
  unlisted or unrelated image.
- Didn't use `tasks-board-app-*`, `tasks-board-running-app-*` (the 71-card noisy scan and the
  since-fixed scanner-quality state) or the old `workflow-chip.png` / `workflow-menu-*.png` /
  `workflow-*-sheet.png` screenshots — those show either a known bug state or the composer-chip/⌘K
  sheet flow that Workflows v2 removed. Using them would misrepresent the current app.
- Didn't call the board "Tasks" in marketing copy even though every real screenshot's on-screen
  heading still says "Tasks" — the brief's own item (3) names it "Notes", and the owner's later
  message (13:47 in the loop ledger) says the board is being reframed as Notes. I wrote the section
  as "Notes" but described only behavior that's actually visible in the screenshots (Suggested /
  Running / Done, Run / Skip), so the copy doesn't claim a UI label that hasn't shipped.
- Removed the old site's scroll-reveal-on-intersection animation entirely (from both `app.js` and
  `styles.css`) rather than keep it: a `page.screenshot({fullPage:true})` capture (Playwright/Chromium
  expands the viewport instead of really scrolling) never fires the `IntersectionObserver`, so every
  section below the fold rendered at ~0 opacity in my own proof shots. Content is now always visible
  regardless of how the page is rendered — simpler, matches "plain sentences, no marketing fluff",
  and removes a dependency on real scroll behavior.
- Kept `docs/research/qa-loop-1-design/{build40,41,43}-workflow-*.png` and `workflow-chip/menu/palette/deck/s10/s11*` untouched
  and unused — superseded UI, out of scope, not copied.
- No price/buy button wired up anywhere (per instruction) — `#` and `#download` are the only two
  placeholder-style links on the whole site.

## How I verified it

- **Local preview:** `python3 -m http.server 5070` from the site root; killed after each check
  (`lsof -ti tcp:5070 | xargs kill`), confirmed stopped.
- **Screenshots** (Playwright via `/Users/vietvk/Projects/VietVK/AgentHub/ui/node_modules/playwright-core`,
  Chromium already cached at `~/Library/Caches/ms-playwright`): home page at 1280×800 light + dark and
  390×844 mobile, changelog at 1280×800 light + dark, and the new Plan page at 1280×800 light + dark
  and 390×844 — 8 files in `docs/`, each captured as a single-viewport (not full-page) shot per the
  "1280×800" / "390×844" sizing in the brief, all ≤300 KB (102–236 KB actual):
  `home-1280x800-{light,dark}.png`, `home-390x844-light.png`, `changelog-1280x800-{light,dark}.png`,
  `plan-1280x800-{light,dark}.png`, `plan-390x844-light.png`.
- **Link check** (real, via a Playwright script, not asserted): every `href` on all three pages
  (`index.html`, `changelog.html`, `plan/index.html`) resolved — same-page `#id` anchors checked
  against `document.getElementById`, relative file links checked with a real `page.request.get` (200
  OK), external `https://github.com/...` link checked with a live `curl -sI` (200). Result: 0 broken
  links. The only bare `href="#"` on the site is the Plan page's "Buy Plan" button; the only
  `href="#download"` is the two Download placeholders (hero + closing CTA), both resolving to a real
  `id="download"` section.
- **Lighthouse-style basics** (via the same Playwright script): zero console errors and zero page
  errors on all 3 pages × both color schemes; exactly one `<h1>` per page; zero `<img>` without an
  `alt` attribute (checked with `$$eval` over every `img` on the page).
- **Responsive / no overflow**: `document.documentElement.scrollWidth - clientWidth` measured `0` at
  360 px width on all three pages.
- **Mobile menu**: clicked the hamburger, confirmed `mobileMenu` gets `.open`; clicked a menu link,
  confirmed it closes; screenshotted after the 200 ms CSS transition settles (an earlier capture mid-
  transition looked broken — that was a test-script timing issue, not a site bug, see below).
- **Theme swap**: confirmed via `colorScheme: "dark"` / `"light"` Playwright contexts that the CSS
  `prefers-color-scheme` media query actually swaps every token (backgrounds, text, accent, the
  `.shot-light`/`.shot-dark` screenshot pairs) — visually checked all 8 proof screenshots.
- **Fonts**: confirmed Geist / JetBrains Mono / Instrument Serif render in the screenshots (the hero's
  "free to run." shows in Instrument Serif italic with the gradient clip).
- Did **not** run a Lighthouse audit proper (no `lighthouse` CLI available in this environment) — the
  "basics" above (console errors, alt text, heading count) are the substitute the brief allows
  ("Lighthouse-style basics via Playwright").

## Bug found and fixed along the way

The old site's scroll-reveal (`IntersectionObserver` + opacity-0-until-visible) made every
`fullPage: true` Playwright screenshot show most of the page at near-zero opacity, because Chromium's
full-page capture resizes the viewport instead of actually scrolling, so the observer never fires.
Removed the mechanism entirely (see "What I deliberately left out" above) rather than special-case the
proof script — real visitors scrolling normally would have been fine, but it's one less moving part
and it fixed the proof capture too.

## Cleanup

- Copied 14 real-app screenshots into `assets/`, then removed 2 that ended up unused after the final
  section-to-image mapping (`assets/tasks-board-app-light.png`, `assets/build53-models-dark.png` —
  the "dark" file was byte-identical to its "light" counterpart, so only one was needed). 13 screenshot
  assets remain, all referenced, all ≤300 KB (94–224 KB each).
- No servers left running (`lsof -ti tcp:5070` empty after the last check), no stray scratch files
  outside this session's scratchpad and `docs/`.
- `.env` was not read or touched (there isn't one in this repo).
- Nothing pushed, nothing deployed — `git status` shows only the branch commits below.

## Commits on `v1-site`

1. `site: rebuild for AgentHub v4 — free lane, worktrees, Notes, workflows, skills, Plan` —
   `index.html`, `styles.css`, `app.js`, `plan/index.html`, `README.md`, `assets/*` (13 real
   screenshots + updated `og.svg`).
2. `site: changelog — v1.0 in progress` — `changelog.html`.
3. `docs: sonnet-35 report + proof` — this file + 8 proof screenshots in `docs/`.
