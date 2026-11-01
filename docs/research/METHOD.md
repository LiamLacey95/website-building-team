# Research method (Discover phase)

Goal: Discover done in one working session (about 4 hours) for a typical brochure or small-business site.

All paths are relative to the repo root. `<slug>` is the active project's slug, found in `.team/STATUS.md` and in `activeProject` in `team.config.json`.

## Output layout

Copy `docs/research/_templates/` into `projects/<slug>/research/` and rename:

| Template | Project file |
|---|---|
| `competitor-teardown.md` | `competitors.md` |
| `persona.md` | `personas.md` |
| `content-inventory.md` | `content-inventory.md` |
| `reference-board.md` | `reference-board.md` |
| `constraints.md` | `constraints.md` |
| `SUMMARY.md` | `SUMMARY.md` |

Screenshots go in:
- `projects/<slug>/research/refs/` for competitors;
- `projects/<slug>/research/refs/board/` for visual references.

Name board files with their board ID first (`d3-monument-valley-desktop.webp` is board entry D3), so the files and the board can't drift apart.

Work from a later phase (for example Define) goes in a subfolder such as `projects/<slug>/research/define/`. Reports go to `projects/<slug>/reports/<brief id>-research.md`.

## Steps and time budget

| # | Step | Time | How |
|---|---|---|---|
| 0 | Read the project brief and list the sector, location, audience and open questions | 10 min | `projects/<slug>/BRIEF.md` and your brief in `projects/<slug>/briefs/` |
| 1 | Find candidates: search for the service plus the location, "best <sector> websites" and award galleries. Shortlist 5 to 8: direct local rivals, sector leaders, one aspirational outsider | 25 min | WebSearch (standard first, extended if thin) |
| 2 | Tear down each site: structure, positioning, patterns, weaknesses, CTA path | 75 min | `web-fetch` agent for content; fetch several sites in parallel (research subagents work well) |
| 3 | Capture screenshots, desktop 1440 and mobile 390 | 15 min | `tools/screenshot.mjs`, see below |
| 4 | Audience: mine reviews (Google, Trustpilot, Reddit, sector forums) and competitor messaging. Write 2 to 3 personas and the jobs to be done | 35 min | WebSearch + web-fetch |
| 5 | Content inventory: pages, blocks, who supplies what | 20 min | From steps 2 and 4 |
| 6 | Constraints: accessibility law, cookie and privacy regime, sector rules, SEO schema, expected integrations | 25 min | Official sources first (regulator, W3C, schema.org) |
| 7 | Reference board: 10 to 20 references in 2 to 4 directions, one line each | 25 min | Award galleries, photographers, type foundries. Save screenshots to `research/refs/board/` |
| 8 | SUMMARY: three insights with evidence and design implications | 15 min | |
| 9 | Commit, write the report, send DONE | 10 min | `git add projects/<slug>/research projects/<slug>/reports/<file>`, then `git commit -m "research: ..." -- projects/<slug>/research projects/<slug>/reports/<file>` (always with a pathspec; the index is shared) |

Total about 4 h 15 min. If time runs short, cut competitors to 5 and references to 10. Never cut the SUMMARY.

## Screenshots

`tools/screenshot.mjs` works on live third-party sites too. Pass the site's origin as `--base` and its path as `--routes`:

```bash
node tools/screenshot.mjs --base https://example.com --routes home --widths 1440,390 \
  --label <site-slug> --out projects/<slug>/research/refs
node tools/screenshot.mjs --base https://pudding.cool --routes 2018/08/pockets --widths 1440,390 \
  --label pudding-pockets --out projects/<slug>/research/refs
```

- Files are named `<HHMM>-<label>-<route>-<width>.png`, with a `manifest.json` written beside them.
- Shots are **full-page** and use **reduced motion**. Long articles make very tall PNGs.
- For viewport-only captures, use Playwright directly from `tools/` instead (Playwright 1.64.1): `npx playwright screenshot --viewport-size=1440,900 <url> <file>`.
- In Git Bash, pass routes by name (`home`), not `/` (see the playbook gotchas).
- Before committing, convert large PNGs to WebP to keep the repo small. Any image tool works; Pillow is in the ComfyUI venv.

## Rules

- Cite every claim with a URL inline. Mark anything not found directly as *(inferred)*.
- Supply options and evidence. Never pick the creative direction.
- Prefer primary sources (the site itself, regulators, W3C, schema.org) over blogs.
- Reference screenshots are third-party content for internal research only. Note this in the teardown and never ship them on the site. If the repo is public, ask the PM whether to keep them.
- Anything the human must answer goes in SUMMARY "Open questions" and in a QUESTION to the PM.

## Tools

- WebSearch (standard and extended modes)
- `web-fetch` agent (reads public pages; fails on logged-in pages and on pages that only render client-side)
- `tools/screenshot.mjs` and Playwright 1.64.1 (installed under `tools/` by `node scripts/bootstrap.mjs`)
- Node 20+
