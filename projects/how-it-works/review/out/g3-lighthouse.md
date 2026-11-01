# Lighthouse

Run: 2026-11-01T23:33:40.783Z. Preset: mobile (default config: emulated Moto G Power, simulated slow 4G, 4x CPU slowdown). Runs per URL: 3 (each figure is the median across runs). Lighthouse 13.6.0.
Budget: LCP < 2.5 s, CLS < 0.1, JS < 150 KB transferred.

| URL | Perf | A11y | Best pr. | SEO | FCP | LCP | CLS | TBT | Speed idx | JS KB | Total KB | Budget |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| http://127.0.0.1:4321/ | 68 | 100 | 96 | 100 | 1.15 s | 1.15 s ok | 0.000 ok | 5404 ms | 3.63 s | 7 ok | 649 | PASS |
| http://127.0.0.1:4322/ | 85 | 96 | 96 | 100 | 1.07 s | 4.37 s **over** | 0.048 ok | 0 ms | 2.16 s | 6 ok | 649 | **FAIL** |
| http://127.0.0.1:4323/ | 96 | 100 | 96 | 100 | 1.29 s | 1.29 s ok | 0.000 ok | 83 ms | 3.72 s | 6 ok | 682 | PASS |

Full reports:
- http://127.0.0.1:4321/: `projects/how-it-works/review/out/g3-lighthouse-html/127-0-0-1-4321.html`
- http://127.0.0.1:4322/: `projects/how-it-works/review/out/g3-lighthouse-html/127-0-0-1-4322.html`
- http://127.0.0.1:4323/: `projects/how-it-works/review/out/g3-lighthouse-html/127-0-0-1-4323.html`

Spread across runs (min to max). A wide CLS or LCP range means the result is flaky; rerun or investigate:
- http://127.0.0.1:4321/ (3 runs): perf 53 to 70, LCP 1.07 s to 3.18 s, CLS 0.000 to 0.074, TBT 4053 to 6657 ms
- http://127.0.0.1:4322/ (3 runs): perf 85 to 96, LCP 2.42 s to 4.38 s, CLS 0.000 to 0.048, TBT 0 to 0 ms
- http://127.0.0.1:4323/ (3 runs): perf 86 to 98, LCP 1.07 s to 1.30 s, CLS 0.000 to 0.268, TBT 0 to 161 ms
