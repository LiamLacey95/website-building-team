# Status board (PM-owned)

## Roster

PM thread id: `fa660062-b3b4-4292-a789-b6fb4858c4e7` (environment `07d2d828-3e5c-4e09-b5de-5d1a274a8d72`)

| Role | Thread title | Thread id |
|---|---|---|
| Research | Team · Research | `thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:0` |
| Concept creator | Team · Concept (ComfyUI) | `thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:1` |
| Front-end design | Team · Front-end Design | `thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:2` |
| Backend | Team · Backend | `thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:3` |
| Review | Team · Review | `thread:mcp:406317ba-0bfb-4435-b210-2935ffdb7cad:team-setup-2026-11-01:4` |

## Active project

`how-it-works`: a creative website that explains how this team works (`projects/how-it-works/BRIEF.md`). Phase 4 Design variations (Gate 2 decided: C · Marble Run); variations done, Gate 3 review in progress.

## Briefs in flight

| Brief | Owner | State |
|---|---|---|
| how-it-works/01-research-discover | Research | done (7ae9124, 32f3abc) |
| how-it-works/02-research-define | Research | done (8c81a8d) |
| how-it-works/02-backend-stack-proposal | Backend + Front-end | done (6990cf9) |
| how-it-works/03-review-gate1 | Review | done: REVISE, then PASS WITH NOTES after the packet revision (71e1b37) |
| how-it-works/04-define-alignment | Research, Backend | done (9c48e5c, d5f0dbc) |
| how-it-works/05-concept-directions | Concept | done (4a01d18) |
| how-it-works/06-review-gate2 | Review | done: PASS WITH NOTES, C 7.7 / A 7.6 / B 7.3 (dc772b4); findings sent to Concept and Front-end |
| how-it-works/07-frontend-g3-variations | Front-end | done (46e914b); three variants live on :4321/:4322/:4323, contact sheet `screenshots/g3/` |
| how-it-works/08-review-gate3 | Review | in progress (critical path to G3) |
| how-it-works/07-concept-marble-run-assets | Concept | done (62ba09d); 18 production images, six-figure cast fixed |
| how-it-works/05-frontend-product-and-scaffold | Front-end | done (624e028) |
| how-it-works/05-backend-contract-vercel | Backend | done (118bc48, b806124) |
| how-it-works/05-review-creativity-rubric | Review | done (6b2d024) |
| how-it-works/05-research-creative-benchmark | Research | done (bfdc459) |
| 05-frontend-telemetry-off | Front-end | done (945a8b7) |
| 03-concept-comfyui-installer | Concept | done (1980bdb) |
| concept no-GPU fallback note | Concept | done (fc7fc3f); option B (remote GPU support) is a Gate 1 question |
| 03-backend-bootstrap | Backend | done (through 2bfed09) |
| 03-review-portability | Review | done (016d9cd, c92a44d) |
| 04-review-kit-audit | Review | done: REVISE (1 blocker, 4 major); report in history |
| Kit packaging | all | **done, handoff-ready**: Review re-test PASS (a5f75ef); briefs and reports in `.team/history/2026-11-01-kit-packaging/`. Public-only items wait for Gate 1 Q2/Q10 |

Note: before Phase 4, confirm the Impeccable hook fires in the Front-end thread (it was added mid-session); if it doesn't, start a fresh Front-end thread.

Setup history: `.team/history/2026-11-01-initial-setup/`.

## Gate 4 checklist (collected along the way)

- Human: Vercel plan. Hobby is non-commercial only (a free kit's showcase probably fits; inferred); Pro is $20/seat/month.
- Human: Vercel account; create the project with `vercel link` (no deploy) or only after the Q10 history rewrite, because a new project's first deploy is production. Deployment Protection "All Deployments" until go-live, then "Standard" (Hobby has no required reviewers).
- PM: Q10 history rewrite with all agents paused; re-sync worktrees and clones.
- Backend: rerun `sync-kit-facts` after the rewrite; release build with `STRICT_SLOTS=1`.
- Credits: add GSAP to `credits.json` if Front-end uses it.

## Gates (how-it-works)

| Gate | State | Decision |
|---|---|---|
| G1 Strategy and scope | **decided** | `gates/G1-strategy/DECISION.md` |
| G2 Creative direction | **decided: C · Marble Run** | `gates/G2-direction/DECISION.md` |
| G3 Design selection | Phase 4 in progress | |
| G4 Release sign-off | not started | |
