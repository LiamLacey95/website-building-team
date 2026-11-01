# Brief 01-review-setup

Owner: Review. Phase: Setup.

Goal: repeatable, mostly automated checks for each gate.

Deliverables (scripts may live in `docs/review/tools/` with their own `package.json`):
1. `docs/review/checklists/G1.md` to `G4.md` and `build.md`: concrete checklists derived from your role file and the playbook's quality bar.
2. A contrast checker: input pairs of hex colours (or a palette file), output ratios and AA/AAA pass or fail.
3. An accessibility runner using `@axe-core/playwright` against a list of URLs, writing a Markdown summary.
4. A Lighthouse runner (mobile preset) against a list of URLs, writing scores and LCP/CLS/TBT to Markdown. Confirm it runs on this Windows machine.
5. Test all three tools against a public site (for example https://www.gov.uk) and include the output in your report.
6. `docs/review/README.md` describing how to run each.

When done: commit your paths, write `.team/reports/01-review-setup-review.md`, send DONE to the PM, then wait.
