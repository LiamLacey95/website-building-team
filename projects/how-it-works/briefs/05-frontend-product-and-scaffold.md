# Brief 05-frontend-product-and-scaffold (project: how-it-works)

Owner: Front-end. Phase: 3, in parallel with Concept. Goal: be ready to start Gate 3 variations the moment the human picks a direction.

Read `gates/G1-strategy/DECISION.md` first: it overrides earlier documents. The measure of success is **how creative, interesting and polished** the site is. Hosting is Vercel, at the site root.

Deliverables:
1. **`/impeccable init`** to write `projects/how-it-works/PRODUCT.md` from `BRIEF.md`, `research/SUMMARY.md`, `research/define/` and the Gate 1 decision. Make the creative ambition and the success measure explicit in it.
2. **Scaffold** `projects/how-it-works/web/`, using Astro 7 per the stack proposal, adjusted for Vercel (no base path) and for the relaxed JS budget:
   - TypeScript;
   - routes for `/`, `/made/`, `/setup/`, `/credits/`, `/llms.txt`, `/story.md`, with placeholder content only;
   - a token layer (CSS custom properties) with neutral placeholder values that a direction's style tile can replace in one file;
   - a reduced-motion toggle;
   - the copy-to-clipboard setup block, as an accessible component;
   - `npm run dev`, `build` and `preview`.
   No visual design yet: that's Gate 3. Commit it on `master`.
3. **Set-piece readiness:** list the techniques you expect the directions to ask for (scroll-driven CSS, View Transitions, canvas, WebGL via a small library, SVG path animation) and note in your report which ones you've prototyped as a 10-minute spike and their cost. Keep spikes out of the scaffold or behind a flag.
4. Confirm the Impeccable design hook fires on an edit under `projects/how-it-works/web/` in your current session. If it doesn't, say so: I'll start a fresh Front-end thread before Gate 3.
5. Screenshot the scaffold with `tools/screenshot.mjs` (four widths) as the project's first visual history entry.

You may message Backend directly about the content model; Backend is publishing it in parallel (`api/contract.md`).
When done: commit with a pathspec, write `reports/05-frontend-product-and-scaffold-frontend.md`, send DONE, then wait.
