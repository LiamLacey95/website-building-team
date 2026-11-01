# Research method (Discover phase)

Goal: Discover done in one working session (about 4 hours) for a typical brochure or small-business site.

## Output layout

Copy `_templates/` into `docs/research/<project>/` and rename:

| Template | Project file |
|---|---|
| `competitor-teardown.md` | `competitors.md` |
| `persona.md` | `personas.md` |
| `content-inventory.md` | `content-inventory.md` |
| `reference-board.md` | `reference-board.md` |
| `constraints.md` | `constraints.md` |
| `SUMMARY.md` | `SUMMARY.md` |

Screenshots go in `<project>/refs/` (competitors) and `<project>/refs/board/` (visual references).

## Steps and time budget

| # | Step | Time | How |
|---|---|---|---|
| 0 | Read the project brief; list the sector, location, audience, and the open questions | 10 min | `.team/briefs/00-project-brief.md` |
| 1 | Find candidates: search for the service + location, "best <sector> websites", award galleries; shortlist 5 to 8 (mix of direct local rivals, sector leaders, one aspirational outsider) | 25 min | WebSearch (standard first, extended if thin) |
| 2 | Teardown each site: structure, positioning, patterns, weaknesses, CTA path | 75 min | web-fetch agent for content; fetch several sites in parallel |
| 3 | Capture screenshots, desktop 1440 and mobile 390 | 15 min | `npx playwright screenshot --viewport-size=1440,900 --full-page <url> refs/<slug>-desktop.png` (or `tools/screenshot.mjs` once built) |
| 4 | Audience: mine reviews (Google, Trustpilot, Reddit, sector forums) and competitor messaging; write 2 to 3 personas and JTBD | 35 min | WebSearch + web-fetch |
| 5 | Content inventory: pages, blocks, who supplies what | 20 min | From steps 2 and 4 |
| 6 | Constraints: a11y law, cookies/privacy regime, sector rules, SEO schema, expected integrations | 25 min | Official sources first (regulator, W3C, schema.org) |
| 7 | Reference board: 10 to 20 refs in 2 to 4 directions, one line each | 25 min | Award galleries, photographers, type foundries; save images to `refs/board/` |
| 8 | SUMMARY: three insights with evidence and design implications | 15 min | |
| 9 | Commit `docs/research/<project>/`, write report, send DONE | 10 min | |

Total about 4 h 15 min. If time runs short, cut competitors to 5 and references to 10, never the SUMMARY.

## Rules

- Cite every claim with a URL inline. Mark anything not found directly as *(inferred)*.
- Supply options and evidence; never pick the creative direction.
- Prefer primary sources (the site itself, regulators, W3C, schema.org) over blogs.
- Screenshot reference images are for internal research only; note the licence and do not ship them.
- Anything the human must answer goes in SUMMARY "Open questions" and in a QUESTION to the PM.

## Tools available

- WebSearch (standard and extended modes)
- `web-fetch` agent (reads public pages; fails on logged-in pages)
- Playwright 1.58.1 via `npx playwright screenshot` (verified working)
- Node 24.11.1
