# Brief 05-concept-directions (project: how-it-works)

Owner: Concept. Phase: 3 Concept. Ends at **Gate 2: creative direction**. Critical path.

## Read first

1. `gates/G1-strategy/DECISION.md`: the human's Gate 1 answers. **They override earlier documents.** Most important: *"A highly creative breakdown of how this setup works. The website will be a showcase of its capabilities, so we are measuring how creative, interesting and polished the final output is."*
2. `research/SUMMARY.md`, `research/reference-board.md` (its four candidate directions: Studio Book, Instrument, Toy Studio, Studio Floor), `research/define/story-outline.md` (10 chapters; still the narrative spine, but quotes and decisions are now written for the story, not quoted).

## What changed since Research wrote the outline

- Creativity, interest and polish are the measure. Be ambitious: this site is the team's portfolio piece.
- Accessibility and reduced motion still apply; "under 10 KB of JS" no longer does. A set piece may use canvas, WebGL or heavier scroll animation if it earns it.
- No time or cost figures. No verbatim quotes required. FLUX Klein images may ship (Q11 A). Hosting is Vercel.

## Deliverables: three directions

In `projects/how-it-works/concepts/<letter>-<name>/` for A, B and C. They must be **genuinely different ideas**, not three palettes on one layout. Each direction is a creative concept for the whole site: a world, a metaphor, a way of telling the story. Start from Research's four candidates, or replace them if you find something stronger.

For each direction:
1. `direction.md`:
   - name and one-line idea;
   - the metaphor: what "the team" and "the process" become in this world;
   - mood words;
   - **the signature set piece**: the one interactive or scroll moment people will remember (for example the double diamond as a physical machine the prompt travels through), described step by step, with its reduced-motion version;
   - how it treats the four gates;
   - type pairing (free licences, with links), palette with computed contrast for every text pair, shape language;
   - risks, including build complexity rated low, medium or high, and the licence note.
2. **Imagery, 6 to 10 generated images:**
   - hero or key art (WEB1);
   - at least two full-page style frames showing the hero and one chapter (WEB4), labelled as mood images;
   - a texture or pattern (WEB5);
   - supporting images for at least two chapters;
   - one "character sheet" for how the six agents are depicted, if the direction depicts them.
   Use WEB2 for consistency across a set. Upscale shipped candidates with WEB6b only. Every image keeps its provenance sidecar. No text inside images.
3. `style-tile.html`: colours, type scale, buttons, a card, a gate card, an image, and a tiny CSS sketch of the set piece's motion if feasible.
4. A one-line hero proposal per direction (the PM's working line is "This website started as one sentence. Here's everything that happened next."; beat it if you can).

Also deliver `projects/how-it-works/concepts/contact-sheet.html`: the three directions side by side, with hero art, a style frame, palette and type, the set piece in two sentences, and build complexity. The PM shows this to the human at Gate 2.

## Working rules

- Check `nvidia-smi` before batches; one model family per batch.
- Review checks for artefacts, fake text, brand lookalikes, contrast and licences, so get ahead of it.
- Research is gathering a short creative benchmark in parallel (`research/creative-benchmark.md`). Use it when it lands, but don't wait for it.
- Commit with a pathspec. Large intermediate images stay in `artgen/output/`; commit only the picks (WebP is fine for boards).

When done: write `reports/05-concept-directions-concept.md` (including what you tried and dropped), send DONE to the PM, then wait.
