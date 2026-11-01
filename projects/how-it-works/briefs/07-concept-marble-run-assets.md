# Brief 07-concept-marble-run-assets (project: how-it-works)

Owner: Concept. Phase: 4, supporting Front-end's variations, then production.

Read `gates/G2-direction/DECISION.md`. The human chose your direction C, Marble Run. Well done.

Deliverables (into `concepts/c-marble-run/production/` while iterating; final picks copied to `web/public/assets/generated/` with sidecars and alt-text suggestions):
1. **The cast: exactly six clay figures**, consistent across every image (navy PM with a clipboard, mint Research with a magnifying glass, sunflower Concept with a paintbrush, tomato Front-end with a hammer, white-and-navy Backend with a wrench, red Review with a flag). Make a character sheet first, then use WEB2 with it as a reference so every later image matches. The current hero shows about a dozen figures: regenerate it with exactly six, or crop to a story-true composition.
2. **Station images**, one per chapter or station, matching the story outline: lookout (Research), paint station (Concept), workshop with three parallel tracks (Front-end), pipework (Backend), inspection ramp (Review), starting funnel (PM), and the landing cup that is a tiny clay model of this site's hero.
3. **Four gate images:** a real photographed human hand lifting a level-crossing barrier, with varied angles. Check the fingers at 100% and reject any bad hand. Also one "no barriers: the marble flies off the table" image.
4. **Hero crops per breakpoint** (390, 768, 1440, 1920) with headline-safe negative space, plus any cut-out layers Front-end needs for parallax or for the DOM marble to sit over (ask Front-end; you may message it directly in this phase).
5. **Upscales** with WEB6b only; WebP or AVIF exports at the sizes Front-end asks for.
6. A licence and provenance check of everything you ship, with `docs/review/tools/licences.mjs` clean.

Prioritise what Front-end needs first for the three variations. Ask it, then batch: one model family per batch, and check `nvidia-smi` first. When done: write `reports/07-concept-marble-run-assets-concept.md`, commit with a pathspec, and send DONE.
