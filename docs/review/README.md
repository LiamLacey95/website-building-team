# Review

Owned by the Review agent. This folder holds gate checklists, review reports, and the scripts that automate the checks.

```
docs/review/
  checklists/   G1.md, G2.md, G3.md, G4.md, build.md
  tools/        contrast.mjs, a11y.mjs, lighthouse.mjs (own package.json)
  out/          tool output (Markdown is committed; HTML, JSON and logs are ignored)
  <brief id>-<subject>.md   review reports
```

## Setup (once)

```powershell
cd "F:\ArtGen\Website Test\docs\review\tools"
npm install
```

Requires Node 20 or later (tested on Node 24.11, Windows 11). The tools use the installed Google Chrome. If Chrome is missing, `a11y.mjs` falls back to Playwright's Chromium (`npx playwright install chromium`), and `lighthouse.mjs` honours the `CHROME_PATH` environment variable.

All commands below run from `docs/review/tools`. URLs can be given as arguments, or with `--urls <file>` (one URL per line, `#` for comments). Local files work as `file:///F:/path/page.html`. Unless you pass `--out`, reports go to `docs/review/out/<timestamp>-<tool>.md`.

## 1. Contrast checker

```powershell
node contrast.mjs "#767676:#ffffff" "#ffdd00:#ffffff:ui" "#ffffff:#1d70b8:large"
node contrast.mjs --palette fixtures/govuk-palette.json --out ../out/contrast.md
```

- Pair syntax is `FG:BG[:kind]`, where kind is `normal` (4.5:1, the default), `large` (3:1) or `ui` (3:1, for WCAG 1.4.11 non-text contrast). It also reports AAA (7:1 normal, 4.5:1 large).
- Hex can be `#rgb`, `#rrggbb` or `#rrggbbaa`. A translucent foreground is composited over the background, which must be opaque.
- Ratios are truncated to 2 decimals, never rounded up, so 4.499 counts as a fail.
- A palette file can take any of three shapes:
  - `{"pairs":[{"label":"Body","fg":"#111","bg":"#fff","kind":"normal"}]}` lists exact pairs. Use this for gates.
  - `{"text":{...},"background":{...}}` checks every text colour on every background.
  - `{"colors":{...}}` checks every unordered pair, for exploring a palette.
- Exits 1 if any pair fails AA for its kind.

## 2. Accessibility runner (axe-core and Playwright)

```powershell
node a11y.mjs https://example.com https://example.com/about --viewports 390,768,1440,1920
node a11y.mjs --urls ../out/g4-urls.txt --viewports 390,1440 --fail-on serious --out ../out/g4-a11y.md
```

- It runs the WCAG 2.0, 2.1 and 2.2 A and AA rule tags (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`). Add `--best-practice` for axe's best-practice rules.
- Each URL is loaded at each viewport width (default `1440`) with `prefers-reduced-motion: reduce`, after load plus up to 10 s of network idle.
- The Markdown has a summary table (counts by impact, needs-review count, passed rules) and, for each URL and width, a table of violated rules with node counts, a help link and an example selector. The raw axe results are saved as `.json` beside it.
- `--fail-on <minor|moderate|serious|critical>` exits 1 when a violation at or above that impact appears, or a page fails to load.
- axe finds only about a third of WCAG failures. The manual keyboard and screen-reader pass in `checklists/G4.md` is still required.
- `fixtures/bad.html` is a deliberately broken page. Run it to confirm the tool still detects problems.

## 3. Lighthouse runner (mobile)

```powershell
node lighthouse.mjs https://example.com --runs 3
node lighthouse.mjs --urls ../out/g4-urls.txt --runs 3 --out ../out/g4-lighthouse.md
```

- It uses Lighthouse's default config, which is the mobile preset: an emulated Moto G Power with simulated slow 4G and a 4x CPU slowdown. `--desktop` switches to the desktop preset.
- Chrome runs headless with a fresh temporary profile for each run, so extensions and cache do not skew results.
- It reports the Performance, Accessibility, Best Practices and SEO scores, plus FCP, LCP, CLS, TBT, Speed Index, JS transferred and total page weight.
- With `--runs N` (use 3 for gates), each figure is the median across runs, and the min-to-max spread is listed so flaky metrics stand out. The HTML report of the median run is saved in `<out>-html/` (skip it with `--no-html`).
- It checks the playbook budget (LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred) and exits 1 if any URL misses it or fails to run.
- "JS KB" is the transfer size of script requests, which is roughly the gzipped size. It covers every script, including third-party ones.

## Tested

All three tools were run on this Windows 11 machine against https://www.gov.uk on 2026-11-01. The results are in `out/test-*.md` and in `.team/reports/01-review-setup-review.md`.
