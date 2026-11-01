# Review tools self-test

Run: 2026-11-01T13:14:25.098Z. Node 24.11.1 on win32. Public site: https://www.gov.uk.

| Check | Expected | Result | Detail | Time |
|---|---|---|---|---|
| Prerequisites | Node 20+, tool dependencies installed | PASS | Node 24.11.1 | 0 s |
| contrast: known ratios | #767676/#fff = 4.54 pass, #777/#fff = 4.47 fail, exit 1 | PASS | exit 1; ratios right | 0 s |
| contrast: palette file | fixtures/govuk-palette.json, 10 pairs, exit 0 or 1 | PASS | exit 1; 10 pairs; **9/10 pairs pass AA.** | 1 s |
| contrast: rejects bad input | exit 2 on an invalid colour | PASS | exit 2 | 0 s |
| axe: broken fixture | finds 7 known rules, --fail-on serious exits 1 | PASS | exit 1; found 7 rules | 80 s |
| axe: public site | https://www.gov.uk loads and is scanned at 390 and 1440 px | PASS | exit 0; 390px 0 violations, 32 rules passed; 1440px 0 violations, 32 rules passed | 177 s |
| Lighthouse: broken fixture | audits a local file over http; accessibility score below 90 | PASS | exit 0; a11y 22, perf 100 | 55 s |
| Lighthouse: public site | https://www.gov.uk audited on the mobile preset | PASS | exit 1; perf 78, LCP 1.71 s, CLS 0.565, budget fail | 59 s |
| Impeccable detector (from tools/) | flags gradient-text, side-tab, overused-font in the slop fixture | PASS | exit 2; 10 rules fired | 0 s |

**9/9 checks passed.**
