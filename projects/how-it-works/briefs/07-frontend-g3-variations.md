# Brief 07-frontend-g3-variations (project: how-it-works)

Owner: Front-end. Phase: 4 Design variations. Ends at **Gate 3: design selection**. Critical path.

Read first: `gates/G2-direction/DECISION.md` (Marble Run chosen), `concepts/c-marble-run/` (direction.md, style-tile.html, tokens.css, images), `gates/G1-strategy/DECISION.md`, `PRODUCT.md`, `api/contract.md`, and Review's `docs/review/checklists/creativity.md` (the G3 bar: weighted score at least 7.0, no axis below 6).

## Steps

1. **Design system on `master`.** Adopt C's token schema (and A and B as lazy alternate themes for the re-skin), fonts and base components. Then `/impeccable document` to write `DESIGN.md`. Wire `content.config.ts` to Backend's contract 0.3.x. Commit.
2. **Three variations, each in its own worktree** (`node tools/variants.mjs create how-it-works a|b|c <name>`). All three are Marble Run; they must differ in a real structural or interaction decision. My suggested hypotheses (change them if `/impeccable shape` gives you something better, and say why):
   - **A · The long run:** Concept's set piece as specified. One continuous scroll-driven track down the whole page, chapters beside the switchbacks, and the marble waits at each barrier. Tests: does one unbroken journey make the process feel physical?
   - **B · Stations:** the page is a sequence of full-viewport dioramas (one per phase) with scroll-snapping or stepped transitions, and the marble passes from scene to scene through View Transitions. Tests: do framed "shots" read as more polished and cinematic than a continuous track?
   - **C · The table:** the whole marble run visible at once as an overview diorama; the visitor drops the marble, zooms into any station (View Transitions), and lifts the barriers. Exploratory rather than linear. Tests: does play-first beat scroll-first for memorability?
3. **Scope per variation:** the home page in full (all 10 chapters, the gate interactions, the "you are the human" re-skin at Gate 2, reduced-motion and no-JS paths) and `/setup/`. Use Backend's draft copy and Concept's images; ask Concept for missing images (you may message Concept directly in this phase about image sizes and crops).
4. **Impeccable for each variation:** `shape`, then build, then `critique` section by section and fix the top-ranked issues, then the detector clean. Record the commands and changes in `variants/<letter>-<name>.md` (committed on master by `variants.mjs`).
5. **Screenshots:** each variation at 390, 768, 1440 and 1920 px, plus short screen recordings or frame strips of each set piece (Playwright video or a frame sequence) so the human can judge motion, not just stills. Build `screenshots/g3/contact-sheet.html` with the three side by side.
6. **Vercel preview builds:** if Backend can produce local `vercel build` output per variant, note it. Nothing is deployed.

## Rules

- Accessibility still applies: keyboard-operable gates, visible focus, reduced motion, alt text.
- GSAP is allowed in `web/` (credit it); prefer CSS where it works.
- Watch usage: work through the variants one at a time, and commit and screenshot as you go, so a usage-limit pause loses nothing.

When done: send DONE to the PM with the contact-sheet path. Review then scores all three for the Gate 3 packet.
