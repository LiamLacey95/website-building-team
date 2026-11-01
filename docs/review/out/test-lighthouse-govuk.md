# Lighthouse

Run: 2026-11-01T11:51:49.051Z. Preset: mobile (default config: emulated Moto G Power, simulated slow 4G, 4x CPU slowdown). Runs per URL: 3 (each figure is the median across runs). Lighthouse 13.6.0.
Budget: LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred.

| URL | Perf | A11y | Best pr. | SEO | FCP | LCP | CLS | TBT | Speed idx | JS KB | Total KB | Budget |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| https://www.gov.uk | 97 | 100 | 100 | 100 | 0.81 s | 1.49 s ok | 0.000 ok | 153 ms | 1.05 s | 54 ok | 196 | PASS |
| https://www.gov.uk/browse/benefits | 78 | 100 | 100 | 100 | 0.82 s | 1.55 s ok | 0.565 **over** | 0 ms | 0.82 s | 51 ok | 172 | **FAIL** |

Full reports:
- https://www.gov.uk: `F:\ArtGen\Website Test\docs\review\out\test-lighthouse-govuk-html\www-gov-uk.html`
- https://www.gov.uk/browse/benefits: `F:\ArtGen\Website Test\docs\review\out\test-lighthouse-govuk-html\www-gov-uk-browse-benefits.html`

Spread across runs (min to max). A wide CLS or LCP range means the result is flaky; rerun or investigate:
- https://www.gov.uk (3 runs): perf 76 to 99, LCP 1.27 s to 1.79 s, CLS 0.000 to 0.566, TBT 71 to 155 ms
- https://www.gov.uk/browse/benefits (3 runs): perf 78 to 99, LCP 1.15 s to 1.56 s, CLS 0.000 to 0.565, TBT 0 to 29 ms
