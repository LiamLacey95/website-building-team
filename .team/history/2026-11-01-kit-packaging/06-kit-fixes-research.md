# Report 06-kit-fixes (Research)

State: DONE. Date: 2026-11-01.

## MAJOR: docs/research/METHOD.md and _templates/ on the old layout (fixed)

- **METHOD.md:**
  - Output now goes to `projects/<slug>/research/` (subfolders such as `research/define/` for later phases). Reports go to `projects/<slug>/reports/`.
  - Step 0 reads `projects/<slug>/BRIEF.md` and the project brief folder.
  - Step 9 commits with a pathspec.
- **New Screenshots section:**
  - `tools/screenshot.mjs --base <origin> --routes <path> --widths 1440,390 --label <site-slug> --out projects/<slug>/research/refs`, checked against https://example.com.
  - Notes that shots are full-page with reduced motion.
  - A Playwright 1.64.1 viewport-only alternative, the Git Bash `/` gotcha, and the PNG-to-WebP advice.
- **Version references:** Playwright 1.58.1 replaced with 1.64.1, the version installed in `tools/`. Node 24.11.1 replaced with "Node 20+".
- **Templates:**
  - Titles use `<slug>`.
  - The competitor and SUMMARY templates name their file path under `projects/<slug>/research/`.
  - The competitor template marks screenshots as internal research only.
  - The board template uses board IDs (`A1`) and `refs/board/<id>-<name>.webp`.
  - No `docs/research/<project>` paths remain.

## NIT: reference-board.md:5 D1/D2 (fixed at the root)

- **What Review saw:** line 5 correctly said that D1 and D2 (Macaulay, Scarry) are links only. The real confusion was that the screenshot file prefixes didn't match the board IDs. For example, D3 Monument Valley was `d2-…`, D4 Kurzgesagt was `d1-…`, and B2 to B4 were shuffled.
- **Renames:** I renamed the board screenshots with `git mv` so every prefix matches its board ID (`b2-standards-manual`, `b3-vercel-geist`, `b4-devouring-details`, `d3-monument-valley`, `d4-kurzgesagt`, `d5-ciechanowski-engine`). The two unused captures are now `extra-pentagram` and `extra-rauno`.
- **Line 5:** rewritten to explain the naming, which entries reuse competitor shots (A4, A5, B5), and which have no screenshot (D1, D2, C5).
- **Check:** all `refs/` links in the research files resolve.
- **The 01 report** now uses the new `extra-*` names.

Commit: see `git log -- docs/research projects/how-it-works/research`.
