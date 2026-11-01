# Review

Owned by the Review agent. This folder holds the gate checklists and the scripts that automate the checks. Project reviews live in `projects/<slug>/review/`.

```
docs/review/
  checklists/   G1.md, G2.md, G3.md, G4.md, build.md
  tools/        selftest, contrast, a11y (axe), lighthouse, licences (own package.json and lockfile)
  examples/     a committed sample self-test report
  out/          kit-level tool output and self-test output (git-ignored)
```

## Setup

`node scripts/bootstrap.mjs` installs these tools. To install them by hand:

```
cd docs/review/tools
npm ci
```

Requirements:

- Node 20 or later.
- A Chromium browser. The tools use installed Google Chrome. Without it, they fall back to Playwright's Chromium, which the bootstrap installs (`npx playwright install chromium` in `tools/`; both folders pin Playwright 1.64.1, so they share one browser build). `lighthouse.mjs` also honours a `CHROME_PATH` environment variable.

Tested on Windows 11 only. The tools use no Windows-specific code, but they have not been run on Linux or macOS yet.

## First start: self-test

```
node docs/review/tools/selftest.mjs                  # about 3 to 5 minutes; works from any folder
node docs/review/tools/selftest.mjs --skip-lighthouse   # about 1 minute
node docs/review/tools/selftest.mjs --site https://example.org
```

The self-test runs every tool the way a reviewer would, and checks that each one works and detects what it should:

- **contrast:** two known ratios, a palette file, and rejection of bad input.
- **axe:** the 7 rules that `fixtures/bad.html` breaks, plus a scan of a public site (default https://www.gov.uk) at 390 and 1440 px.
- **Lighthouse:** the broken fixture (served locally) and the public site, on the mobile preset.
- **Impeccable detector** (run from `tools/`, where Front-end pins it): it must flag `fixtures/slop.html`.

It exits 0 when every check passes, 1 when a tool is broken, and 2 when the self-test itself crashes. Findings on the public site never fail it. The report goes to `docs/review/out/selftest/selftest.md`. See `examples/selftest.md` for a sample.

## Where output goes

Unless you pass `--out`, the tools write to `projects/<activeProject>/review/out/`, taking `activeProject` from `team.config.json` (or from `--project <slug>`). If no project is set, they write to `docs/review/out/`. In a project's `out/`, the Markdown summaries are gate evidence and are committed; the HTML, JSON and log files are ignored by a `.gitignore` the tools create there.

All reports show URLs as given and local files as repo-relative paths, so nothing machine-specific gets committed.

## Exit codes (all tools)

`0` clean, `1` findings (site, palette or licence problems), `2` the tool could not do its job (bad input, a page that would not load, a crashed run).

## Tools

Run these from `docs/review/tools/`. Targets can be URLs, local `.html` files or folders (served on `http://127.0.0.1` for the run), or a list file passed with `--urls <file>` (one per line, with `#` for comments).

### contrast.mjs

```
node contrast.mjs "#767676:#ffffff" "#ffdd00:#ffffff:ui" "#ffffff:#1d70b8:large"
node contrast.mjs --palette fixtures/govuk-palette.json --out ../out/contrast.md
```

- The pair syntax is `FG:BG[:kind]`, where kind is `normal` (4.5:1, the default), `large` (3:1) or `ui` (3:1, for WCAG 1.4.11 non-text contrast). It also reports AAA (7:1 normal, 4.5:1 large).
- Hex can be `#rgb`, `#rrggbb` or `#rrggbbaa`. A translucent foreground is composited over the background, which must be opaque. Ratios are truncated, never rounded up.
- A palette file takes one of three shapes:
  - `{"pairs":[{"label":"Body","fg":"#111","bg":"#fff","kind":"normal"}]}` lists exact pairs. Use this for gates.
  - `{"text":{...},"background":{...}}` checks every text colour on every background.
  - `{"colors":{...}}` checks every unordered pair, for exploring a palette.

### a11y.mjs (axe-core and Playwright)

```
node a11y.mjs https://example.com https://example.com/about --viewports 390,768,1440,1920
node a11y.mjs --urls ../../../projects/<slug>/review/g4-urls.txt --viewports 390,1440 --fail-on serious
```

- It runs the WCAG 2.0, 2.1 and 2.2 A and AA rule tags. Add `--best-practice` for axe's best-practice rules.
- Each URL is loaded at each width (default `1440`) with `prefers-reduced-motion: reduce`.
- The Markdown has a summary table (counts by impact, needs-review count, passed rules) and a table of violated rules per URL and width. The raw axe JSON is saved beside it.
- `--fail-on <minor|moderate|serious|critical>` exits 1 when a violation at or above that impact appears.
- axe finds only about a third of WCAG failures. The manual keyboard and screen-reader pass in `checklists/G4.md` is still required.

### lighthouse.mjs (mobile)

```
node lighthouse.mjs https://example.com --runs 3
node lighthouse.mjs --urls ../../../projects/<slug>/review/g4-urls.txt --runs 3
```

- It uses Lighthouse's default mobile preset (an emulated Moto G Power, simulated slow 4G, 4x CPU slowdown). `--desktop` switches to the desktop preset. Each run gets a fresh headless profile.
- It reports the Performance, Accessibility, Best Practices and SEO scores, plus FCP, LCP, CLS, TBT, Speed Index, JS transferred and total weight.
- With `--runs N` (use 3 for gates), each figure is the median across runs, and the min-to-max spread is listed so flaky metrics stand out. The median run's HTML report is saved in `<out>-html/` (skip it with `--no-html`).
- It checks the playbook budget (LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred) and exits 1 if a URL misses it.
- Dismiss consent banners before measuring: a banner inserted above the content made gov.uk's CLS swing between 0 and 0.57.

### licences.mjs (generated images)

```
node licences.mjs ../../../projects/<slug>/web/public/assets/generated --out ../../../projects/<slug>/review/out/g4-licences.md
```

For every image it finds the provenance sidecar that `artgen/generate.py` writes, and walks the whole chain, including nested source provenance:

- **FAIL:** there is no sidecar, or a non-commercial model or licence appears anywhere in the chain (4x-UltraSharp, CC BY-NC).
- **NOTE:** FLUX Klein, which is free for commercial use only under US$5M annual revenue. Confirm the client qualifies.
- **PASS:** everything else.

It exits 1 on any FAIL.

### Impeccable detector

This isn't a review tool, but Review runs it at G3, G4 and in build reviews. Always run it from `tools/`, where the CLI is pinned: `cd tools && npx impeccable detect [--json] [--viewport 390x844] <path or url>`. It exits 0 when clean and 2 when it finds something. It skips `node_modules`.

## Fixtures

- `tools/fixtures/bad.html`: a deliberately inaccessible page (7 known axe violations).
- `tools/fixtures/slop.html`: deliberately generic "AI default" styling, for the detector.
- `tools/fixtures/govuk-palette.json`, `tools/fixtures/urls-govuk.txt`: sample inputs.

Do not fix the fixtures. The self-test depends on them being broken.
