# Brief 08-review-gate3 (project: how-it-works)

Owner: Review. Phase: Gate 3 internal check. Critical path.

Score Front-end's three Marble Run variations against `docs/review/checklists/G3.md` and `creativity.md`. The G3 bar is a weighted score of at least 7.0 with no axis below 6.

Read Front-end's report `reports/07-frontend-g3-variations-frontend.md`, the hypothesis records `variants/{a-long-run,b-stations,c-table}.md`, and `gates/G2-direction/DECISION.md` plus your own G2 review (check whether your C findings were fixed).

Judge the **live builds**, not only the stills: A on http://localhost:4321/, B on :4322, C on :4323, each with `/setup/`. They are Front-end's dev servers, so don't stop them; if one is down, start it from its worktree on the same port. Use the evidence too: `screenshots/g3/` (contact sheet, 24 shots, motion webms).

For each variation:
- the creativity scorecard (all five axes with evidence, the weighted score, the memorability sentence) and whether it meets the G3 bar;
- whether its hypothesis held (does the structure actually deliver what it set out to test?);
- the G3 checklist: a11y (keyboard gates, focus, reduced motion, no-JS, axe), contrast, responsive at 390, 768, 1440 and 1920, performance (Lighthouse on a production build if feasible), CSP, imagery (six-figure cast, clean hands, no fake text), licences;
- the top three changes that would most raise its score in Phase 5.

Front-end's own first-build estimates were A 6.45, B 6.55 and C 6.05, before the fixes and the production imagery. Score independently. If none clears the bar, say so plainly and say which one is closest and what it needs; if a hybrid (for example B's framing with C's play) would beat all three, say so with reasons.

Finish with your ranking and recommendation.

Deliverable: `projects/how-it-works/gates/G3-design/review.md`. The PM assembles the rest of that folder.
When done: commit with a pathspec, then send DONE with the verdict, the three scores and your ranking.
