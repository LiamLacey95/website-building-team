# Review: Gate 2, creative direction (how-it-works)

Brief: `projects/how-it-works/briefs/06-review-gate2.md` · Checklists: `docs/review/checklists/G2.md`, `creativity.md` · Reviewer: Review · 2026-11-01

Verdict: **PASS WITH NOTES.** The human has already chosen C · Marble Run, and C meets the Gate 2 bar.
- **Ranking: C (7.7), A (7.6), B (7.3).** I agree with Concept that C should come first, but I rank A above B (reasons below).
- **Before Gate 3:** C's image set needs one consistency round. That's the MAJOR below, and it's build input that doesn't affect the choice: if it isn't fixed before Front-end builds with these images, it becomes a Gate 3 blocker.

## Scope

- **Read in full:** the three `direction.md` files, Concept's report, the images READMEs, `_fonts/FONTS-LICENCE.md`, the three `tokens.css` files, and the spike results in `reports/05-frontend-product-and-scaffold-frontend.md`.
- **Rendered:** the three style tiles and `contact-sheet.html` at 1440 and 390 px, with and without `prefers-reduced-motion`. I scrolled through each page so lazy images load, checked every `<img>` (all load), and took section crops of each set piece.
- **Tools:**
  - `a11y.mjs` on the tiles and the contact sheet;
  - Impeccable `detect` (from `tools/`) on all four;
  - `contrast.mjs` on 24 token pairs per direction, recomputed from `tokens.css` rather than taken from the docs;
  - `licences.mjs` on `concepts/`.
  - Outputs are in `projects/how-it-works/review/out/g2-*`.
- **Images:** I viewed all 9 C images whole, and cropped the hand in `c-hand` at 100% and 2x, plus two details of `c-diverge`. For A and B I viewed the key art and character sheets.

## Creativity scorecards (as potential; `creativity.md`)

### C · Marble Run (chosen)

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | You could identify it from a 200 px crop: sunflower wall, navy outlines, clay and birch, and a toy-depth hard shadow. The tile's type (Bricolage 800 condensed with Atkinson) holds up as grown-up typography (`style-tile.html`, the hero and type sections) |
| C | 9 | Marble = prompt, track = double diamond, real hand = human. It runs through the whole page and would be very hard to reskin. "Run it without humans" is the best explanation device of the three |
| S | 8 | A clear arc (drop, diverge, wait, lift, land in a cup that is this site's hero) and a counterfactual device that *shows* the value of the four gates |
| P | 6 | The tile itself is polished (0 axe violations, clean detector). But the image set isn't consistent yet: off-cast figures in 4 of 9 images, a tangled-limb artefact and a prop mix-up (MAJOR below). Two cast members share one colour |
| U (risk) | 7 | Native scroll, the track is decorative over real text, there's a designed static version (checked: in reduced motion the track is fully drawn and the marble rests at the end), and drag is optional with a button. Risk: the long responsive path and the "wait at the gate" behaviour aren't spiked yet |

**Weighted: 7.7 · Awwwards-weighted: 7.5.**
- **Memorability:** "A glass marble rolls down the whole page, and a real human hand has to lift each barrier." Pass.
- **AI tells:** none (0 slop findings). There are 27 `hard-offset-shadow` findings, an advisory quality rule; they're deliberate and justified in `direction.md`, so record them in `DESIGN.md`.
- **Biggest lift available:** a consistent six-figure cast across every station image (that takes P from 6 to 8, and the weighted score to about 8.1).

### A · Paper Trail (for the record)

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | The single most coherent art direction: green blotter, paper, brass, one vermilion, real flat-lay photography (`a-tools` is clean and well composed), and a book-like type system |
| C | 7 | The stamp and the binding finale are specific to this subject, but "editorial desk" is a familiar register. Concept's own risk ("merely tasteful") is fair |
| S | 8 | The strongest narrative spine (one sheet becomes a bound book). "Lift the tracing paper" explains briefs-in and reports-out directly |
| P | 7 | A polished tile. In the lift device, the under-sheet heading shows through the top sheet ("What came back" over "What was asked"), which makes both hard to read. The brass straightedge carries tick marks, which the prompt tried to avoid |
| U (risk) | 8 | Native scroll, static default, cheapest build. The reduced-motion diamond is fully drawn |

**Weighted: 7.6 · Awwwards-weighted: 7.6.** Memorability: "You stamp the four decisions yourself and the page you scrolled gets bound into a book." Pass.

### B · Signal Path (for the record)

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | The most cinematic art direction: product photography, one warm signal colour, Archivo at width 125 used well. But the hero image is about 55% black empty frame |
| C | 8 | The instrument metaphor is carried through everything. "Pull a cable" is a strong device |
| S | 7 | Strong devices, but the most abstract metaphor (Sam needs the legend the doc mentions). "Your sentence, routed" is a nice touch |
| P | 7 | A tight tile. The reduced-motion scope trace has a gap between the G1 plateau and G3, so it isn't "complete" as specified. The hero cables loop into each other and a plug floats free |
| U (risk) | 6 | Canvas scope, sticky screen, a dark theme for long reading, and the highest build cost |

**Weighted: 7.3 · Awwwards-weighted: 7.1.** Memorability: "It's a synthesiser; you throw a switch at each gate and can unplug Review to see the bugs that would have shipped." Pass.

**Ranking:** C 7.7, A 7.6, B 7.3.
- All three pass the G2 bar (C ≥ 7 and D ≥ 7 as potential, memorability passes, no slop tells), and the three memorability sentences are clearly distinct.
- I rank A above B, while Concept had B second. B's creative ceiling is higher, but its usability and build risk are the highest, and its story is the most abstract. A is nearly as strong on the measure with a fraction of the risk.
- This doesn't affect the human's choice.

## Findings on C (build input for Concept and Front-end)

**[MAJOR] Images: the cast isn't consistent in 4 of 9 images (Concept).** `c-cast.webp` defines exactly six figures with body-colour faces, dot eyes, smiles and one prop each. Against it:
- **`c-hero.webp` (key art):** **about 14 figures** in mixed styles: hair, skin-tone faces, two-tone bodies, a figure with a bun. It contradicts "six agents" in the image that opens the site.
- **`c-hand.webp`:** the navy PM and red Review figures have skin-tone faces and hair, not the cast's look. The hand itself passes (below), so keep the hand and re-do the figures with WEB2 against the cast sheet.
- **`c-diverge.webp`:**
  - off-cast figures: a teddy bear (top left), a gnome in a red cap, and an orange figure;
  - the bottom-right figure (navy head, red body) has **tangled limbs**: one arm wraps across the body into a third limb-like shape. This is a generation artefact.
- **`c-studio.webp`:** six figures, but the **navy PM holds both the clipboard and Concept's paintbrush**, the yellow Concept figure has no prop, and the faces have no mouths.
- **Fix:** regenerate hero, diverge and studio, and re-do the figures in hand, with WEB2 using `c-cast` as the reference. The hero should show exactly the six cast figures (or none). Keep `c-research` and `c-cast` as they are.

**[MINOR] Images: two cast members share one colour (Concept).** In `c-cast` and `c-studio`, Front-end ("tomato") and Review ("red") are the same red and only the prop tells them apart. The site's "who talks to whom" device and the station figures rely on telling roles apart at small sizes. Give one a distinct colour (from the palette, for example `sky` for Review with the red flag), and update `direction.md` and the tokens.

**[MINOR] Contrast: one token pair fails, and is latent (Concept, then Front-end).** I recomputed C's tokens: 18 of 24 pairs pass.
- **`--c-on-accent` `#FFFFFF` on `--c-accent` `#E8492C` measures 3.87:1**, which fails for normal text. The tile never renders it, but the shared theme schema invites it: in A (5.36) and B (10.73) the same pair passes.
- Navy on tomato (3.99) fails too.
- **Fix:** in C, only put text on tomato at 24 px or larger (or 19 px bold); for smaller text use `tomato-ink` `#B7321A` (white on it measures 6.03). Encode this in the tokens, for example by pointing `--c-accent` (the fill behind text) at tomato-ink and keeping tomato for shapes only.
- **UI colours on the yellow wall:** `go` mint on sun is 1.44:1 and `gate`/`hold` tomato on sun is 2.45:1. They're fine as decoration with text labels, but any barrier or lamp that carries meaning on the yellow wall needs its navy outline (as in the tile) or a white or sky backing to meet 1.4.11.

**[MINOR] Set-piece feasibility (Front-end).** What's been proven so far:
- the scroll-drawn track, in all three directions;
- path following via CSS `offset-path`, **Chromium only**, so use the recommended JS `getPointAtLength` route (0.4 KB);
- cross-document view transitions.

What hasn't been spiked:
1. **The marble waiting at a closed gate while the page keeps scrolling.** The timeline has to split per gate, with state. This is the core of the concept.
2. **"Run it without humans":** the overshoot, the fly-off and the reset.
3. **Ghost marbles in Discover.**
4. **A track authored per breakpoint** (four widths).

Spike 1 and 2 first in Phase 4. Also check Firefox and Safari: the spikes ran only in Chromium 156.

**[MINOR] Reduced motion (Front-end).** The static version is well designed (verified in the tile). The spec's "marble resting at each station as a static illustration (one per chapter)" adds about 8 images or CSS states to the asset list, so budget for it.

**[MINOR] Style frames (Concept, Front-end).** `c-frame-home` and `c-frame-chapter` contain garbled pseudo-text ("Civien Bees aiie", "Ouisore bes tef"). They're correctly labelled as mood images. Keep them out of `web/` entirely: the licence guard passes them because the licence is fine, but the fake text is not shippable.

**[MINOR] Gate packet: the contact sheet (PM).** At 390 px it overflows horizontally by 12 px (the table). axe reports a serious `aria-prohibited-attr` on the palette chips (`<div class="chips" aria-label=…>`); add `role="img"`.

## Checks that pass

- **The hand (`c-hand`):** checked at 100% and 2x.
  - Index and middle fingertips rest on the left end of the barrier, each with a plausible nail.
  - The thumb presses the right end and has a soft thumbnail.
  - Ring and little fingers fold behind.
  - Five digits, no extra or fused fingers, natural skin texture.
  - The barrier, posts, marble and flag are coherent, and the flag is a single red pennant (no national-flag reading).
- **Fake text:** none in any non-frame C image. `c-cast` shows clipboard lines, not letters.
- **Brand lookalikes:** none found. The figure I checked in `c-diverge` (head with a top knob and a side bun) does not read as a known character.
- **Licences:** `licences.mjs` on `concepts/` finds 26 images, 26 sidecars and **0 fail**. All 26 are FLUX Klein (NOTE), which Gate 1 Q11 A covers (revenue with affiliates under US$5M). There's no non-commercial step in any chain. The heroes' 2x masters are WEB6b (RealESRGAN, BSD-3), kept outside git.
- **Fonts:** all 7 families are SIL OFL 1.1, with copyright lines and the full licence text in `_fonts/FONTS-LICENCE.md`, self-hosted. Atkinson Hyperlegible Next, Bricolage Grotesque, Archivo, Martian Mono, Young Serif, Newsreader and Courier Prime are all OFL.
- **Contrast in the rendered tiles:** axe finds 0 violations on all three tiles at 390 and 1440. B's 24 token pairs all pass. A's 4 token failures are pairings its doc rules out (vermilion never on the blotter), and the tile honours that.
- **Detector:** 0 slop findings on all three tiles and the contact sheet.
- **Distinctness:** three different worlds (paper, instrument, toy), palettes (green, black, yellow), type systems, devices and memorability sentences.
- **Fit with the G1 decision:**
  - all three are highly creative showcases (Q3);
  - none publishes time or cost (Q6);
  - no direction claims a no-GPU path (Q7 D);
  - hero lines are offered as alternatives to the working line (Q8).
  - C's "childish" risk for Tomás has the right mitigation: dry copy, grown-up type, crisp artefacts.

## Hand-off

- **Concept:** the image MAJOR, the cast colour, the token fix and keeping the style frames out of `web/`.
- **Front-end:** spike "wait at the gate" and "run without humans" first, use JS path following, test in Firefox and WebKit, budget for the reduced-motion station states, and record `hard-offset-shadow` in `DESIGN.md`.
- **PM:** the contact sheet fixes are cosmetic, since the decision is already made.
