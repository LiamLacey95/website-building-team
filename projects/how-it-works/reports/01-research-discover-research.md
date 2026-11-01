# Report 01-research-discover (Research, project how-it-works)

State: DONE. Date: 2026-11-01.

## Delivered (projects/how-it-works/research/)

| File | Contents |
|---|---|
| `SUMMARY.md` | One page: three insights, personas at a glance, competitive gap, must-haves, recommended answers to the four open questions in the brief, and three new questions |
| `competitors.md` | 8 teardowns: 3 explainers (Ciechanowski, The Pudding, Transformer Explainer), 3 agent/dev-tool sites (Claude Code, Cursor, Factory), 2 process pages (Shape Up, Work & Co). Also Linear Method, Design Council and CrewAI. Comparison table, patterns to adopt and to avoid |
| `personas.md` | Maya (agent-native builder), Tomás (studio owner or freelancer), Sam (handed the repo), each with sourced objections (tokens, slop, GPU cost, Mac, licences, AI-image ownership) and what would convince them; table of jobs to be done |
| `content-inventory.md` | 18 concepts, each with the real artefact that can illustrate it (marked exists now / produced later), page list, what the human must supply, what we can draft |
| `reference-board.md` | 19 references in 4 directions: A Studio Book (editorial), B Instrument (technical), C Toy Studio (playful), D Studio Floor (cutaway illustration), with palette and type cues and ComfyUI fit |
| `constraints.md` | WCAG 2.2 SCs for scroll storytelling with a do/don't list, browser support for scroll-driven CSS, GitHub Pages limits and deploy, licence and attribution table, cookies and privacy, SEO and sharing, integrations |
| `refs/` | 30 competitor screenshots (desktop, desktop scrolled, mobile) and 16 board screenshots in `refs/board/`, as WebP (2.4 MB total) |

## Headline findings

1. Trust is the bottleneck: 3.1% of developers highly trust AI output and 93% want attribution. The site's edge is to follow its own prompt through the team and show the real artefacts.
2. One sentence plus one diagram. Put the setup sentence in the hero with a copy button, as Factory does, and use the double diamond with the four named gates as hero, nav and progress bar. The diagram is CC BY 4.0, so we can redraw it with credit.
3. CSS scroll-driven animations ship in all three engines as of Firefox 159 (27 Oct 2026). Creative can be static-first, motion-optional and light. None of the acclaimed explainers handles reduced motion.

Recommendations for G1: keep the name "Website Building Team"; GitHub Pages via Actions, public at G4; fully meta (the site's own run is the spine); Apache-2.0 for the repo.

## Things the PM should know

- **Licence correction for Concept and the README.** FLUX 3 Image Klein is the "under US$5M revenue" licence (FLUX Kommunity v1.0, verified). FLUX.2 [klein] 9B is non-commercial and FLUX.2 [klein] 4B is Apache-2.0. The kit's README is correct; it just needs to keep the model names exact.
- **Impeccable ships a NOTICE.md** (Apache-2.0, includes MIT-licensed ehmo files). Whoever packages the kit should keep LICENSE and NOTICE with `.claude/skills/impeccable`.
- **Dependency on later phases:** a fully meta site needs G2 to G4 artefacts that don't exist yet. The build must leave slots that are filled at Phase 5. Someone should also log time (and ideally cost) for this project from now on if the site is going to quote it.
- **Reference screenshots are third-party content.** Committed for internal use. If the repo goes public, the PM may prefer to git-ignore `projects/*/research/refs/`. I did not put them on any page.
- An open item for Concept or PM: does the kit work without an NVIDIA GPU (for example, skipping image generation)? The site has to say which is true.

## Tools used

WebSearch, web-fetch, research subagents (general-purpose, foreground), Playwright 1.58 (via `tools/node_modules`) for viewport screenshots, Pillow for WebP conversion. Some sites showed cookie banners in the captures (Claude Code, Cursor, Pentagram, Kurzgesagt, Works in Progress); I left them as they are.

Time: one session, as budgeted.
