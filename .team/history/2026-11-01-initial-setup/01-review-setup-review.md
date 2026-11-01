# Report 01-review-setup (Review)

Status: DONE. All deliverables are in place, and all three tools were tested on this Windows 11 machine (Node 24.11.1, Chrome 156) against https://www.gov.uk.

## Deliverables

| # | Deliverable | Path |
|---|---|---|
| 1 | Gate checklists | `F:\ArtGen\Website Test\docs\review\checklists\G1.md`, `G2.md`, `G3.md`, `G4.md`, `build.md` |
| 2 | Contrast checker | `F:\ArtGen\Website Test\docs\review\tools\contrast.mjs` |
| 3 | axe accessibility runner | `F:\ArtGen\Website Test\docs\review\tools\a11y.mjs` |
| 4 | Lighthouse mobile runner | `F:\ArtGen\Website Test\docs\review\tools\lighthouse.mjs` |
| 5 | Test output | `F:\ArtGen\Website Test\docs\review\out\test-*.md` (summarised below) |
| 6 | How to run | `F:\ArtGen\Website Test\docs\review\README.md` |

The tools share `tools/lib.mjs` and have their own `package.json` (`@axe-core/playwright` 4.14, `playwright` 1.64, `lighthouse` 13.6, `chrome-launcher` 1.2). Setup is `npm install` in `docs/review/tools`.

## Test results

### Contrast (`contrast.mjs --palette fixtures/govuk-palette.json`)
There are 10 GOV.UK colour pairs, and 9 of them pass AA. Body text #0b0c0c on white measures 19.58:1, the link colour #1d70b8 measures 5.16:1, and the error colour #d4351c measures 4.85:1. The yellow focus colour #ffdd00 against white measures 1.34:1 as a UI colour and fails, which is correct: GOV.UK pairs it with a black underline, so the yellow alone does not carry the indicator. Known reference values check out (#767676 on white gives 4.54:1, a pass; #777 gives 4.47:1, a fail). Translucent foregrounds are composited correctly. Exit code 1 when any pair fails.

### Accessibility (`a11y.mjs --urls fixtures/urls-govuk.txt --viewports 390,1440`)

| URL | Width | Critical | Serious | Moderate | Minor | Passed rules |
|---|---|---|---|---|---|---|
| https://www.gov.uk | 390 | 0 | 0 | 0 | 0 | 32 |
| https://www.gov.uk | 1440 | 0 | 0 | 0 | 0 | 32 |
| https://www.gov.uk/browse/benefits | 390 | 0 | 0 | 0 | 0 | 28 |
| https://www.gov.uk/browse/benefits | 1440 | 0 | 0 | 0 | 0 | 27 |

Since a clean result alone does not prove detection, I also ran a deliberately broken fixture (`tools/fixtures/bad.html`). It reported 3 critical issues (button-name, image-alt, label) and 4 serious ones (color-contrast, document-title, html-has-lang, link-name). With `--fail-on serious` it exits 1.

### Lighthouse, mobile preset (`lighthouse.mjs --urls fixtures/urls-govuk.txt --runs 3`)
I confirmed the mobile settings in the report itself: formFactor mobile, Moto G Power user agent, 150 ms RTT, about 1.6 Mbps, 4x CPU slowdown.

| URL | Perf | A11y | BP | SEO | LCP | CLS | TBT | JS KB | Budget |
|---|---|---|---|---|---|---|---|---|---|
| https://www.gov.uk | 97 | 100 | 100 | 100 | 1.49 s | 0.000 | 153 ms | 54 | PASS |
| https://www.gov.uk/browse/benefits | 78 | 100 | 100 | 100 | 1.55 s | 0.565 | 0 ms | 51 | FAIL (CLS) |

Each figure is the median of 3 runs. CLS ranged from 0.000 to 0.565 on both URLs. The trace shows a single shift of `<main id="content">`, consistent with the cookie banner being inserted above the content on some loads. After seeing this in the first test I changed the runner to report per-metric medians plus a min-to-max spread line, so flaky metrics are visible rather than hidden. A full HTML report is saved per URL.

## Notes for the team
- Use `--runs 3` for any gate measurement. A single mobile Lighthouse run can swing by about 20 performance points.
- The JS budget is measured as the transfer size of all script requests, roughly the gzipped size, including third-party scripts.
- axe covers only part of WCAG. The G3 and G4 checklists include the manual keyboard and screen-reader steps.
- Cross-viewport screenshots are Front-end's tool (`tools/`). G3 and G4 use it rather than duplicating it.
- Tool outputs go to `docs/review/out/`. The Markdown is committed; the HTML reports, JSON and logs are git-ignored.

Needs: nothing.
