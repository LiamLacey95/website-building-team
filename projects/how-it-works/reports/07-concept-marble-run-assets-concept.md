# Report 07-concept-marble-run-assets (Concept)

State: DONE for Front-end's P1 and P2 list. There are 18 production images, each with a sidecar (provenance plus `alt`), in `web/public/assets/generated/`. The same files plus a README (prompts and seeds) and a licence report are in `concepts/c-marble-run/production/`.

## The cast: exactly six, consistent everywhere

- **Character sheet first** (`c-cast`): a WEB2 edit of the Gate 2 sheet that fixes Review's finding that Front-end and Review shared one red.
  - navy PM with a clipboard;
  - mint Research with a magnifier;
  - sunflower Concept with a brush;
  - **orange** Front-end with a hammer;
  - **white Backend in navy overalls** with a wrench;
  - **crimson** Review with a plain red pennant.
- **Every later image** was made with WEB2 using the sheet as `<ref_image_0>`. I checked each pick for figure count, colours and props.
- **Matching tokens:** `--agent-*` colours were added to all three themes' `tokens.css` (commit 6f3c8d9), and Front-end has been told.

## Delivered (names as sent to Front-end)

| File | What | Size |
|---|---|---|
| `c-hero`, `c-hero-2x` | Hero 16:9: exactly six figures, marble at the top start, left ~55% empty wall. WEB2 against the cast, then a WEB6b 2x upscale | 1600x900, 3200x1800 |
| `c-hero-tablet` | 4:3 crop of the same shot | 1536x1152 |
| `c-hero-mobile` | 4:5 recomposition with the same six (headline goes above it on mobile) | 1080x1350 |
| `c-hero.marble.json` | the photo marble's centre and radius per hero file (fractions), checked with an overlay, for the DOM marble | n/a |
| `c-cast` | character sheet | 1536x1024 |
| `c-station-pm`, `-research`, `-concept`, `-frontend`, `-backend`, `-review` | one station per agent: subject on the right half, left third clean wall | 1536x1024 |
| `c-gate-1` | Front-end's P1.2: a real hand lifts the barrier, centred, with the PM and Review watching | 1536x1024 |
| `c-gate-2`, `-3`, `-4` | further gate angles (low, from above, wide) with Front-end, Concept, Backend and Review | 1536x1024 |
| `c-nohumans` | "without humans": the marble flies towards a tin bin | 1536x1024 |
| `c-landing` | the marble resting in a clay cup | 1536x1024 |
| `c-marble` | single glass marble reference for the CSS marble | 1024x1024 |

## Review's Gate 2 findings: what I did

- **MAJOR, inconsistent cast in 4 of 9 images:** fixed in production; all shipped images use the cast sheet.
  - **Hero:** regenerated with exactly six figures; the Gate 2 hero had about 14.
  - **`c-hand` (off-cast figures):** `c-gate-1` keeps the approved hand, barrier and marble exactly, and a WEB2 edit swaps the two off-cast figures for the cast's PM and Review.
  - **`c-diverge` and `c-studio`:** not in Front-end's list, so they were not reshot. The cast-correct prompts are ready (`st-diverge`, `st-studio`) if they are needed.
- **Hands checked at 100%:** `c-gate-1` reuses the hand Review already passed. For `c-gate-2`, `-3` and `-4` I inspected the hands at 100%: natural thumbs and nails, no extra or fused fingers. Rejected:
  - an angle where the barrier floats with no post;
  - a crowded four-figure crossing;
  - the first gate attempts, where the hand reference dragged in the old off-cast figures.
- **MINOR, token fixes:** done (6f3c8d9).
  - Marble Run's `--c-accent` is now the text-safe tomato-ink (white on it 6.03:1);
  - the bright tomato moved to `--c-accent-bright` (shapes only);
  - Front-end and Review have distinct agent colours.
- **Style frames stay out of `web/`:** none were copied.

## Licence and provenance

- `node docs/review/tools/licences.mjs` on the shipped folder: **0 fail**. Every image is FLUX Klein (the revenue NOTE, accepted at Gate 1, Q11). The heroes add RealESRGAN (BSD-3), and none use 4x-UltraSharp.
- The report is saved as `concepts/c-marble-run/production/licences.md`.
- Every `.json` sidecar carries the full API graph. Upscales embed their source's record, and crops record the crop box.

## What I tried and dropped

- **The first hero attempts:** three of four seeds dropped one figure, so I counted figures on every candidate.
- **The 4:5 mobile hero:** one seed added a seventh figure. The pick has exactly six, but its empty band is about 20%, not 45%, so the headline goes above it.
- **The first station batch** ran without Front-end's composition rules. I stopped it when their list arrived and re-ran with "subject right, left third clean" in every prompt.
- **Gate images with the hand photo as the main reference:** they copied that photo's off-cast figures and its camera angle. Fixes:
  - for the centred shot, keep the photo and swap only the figures;
  - for new angles, generate from the cast sheet and check the hands.

## Kit change

`artgen/tools/export_picks.py` now supports:
- `crop` (fractions);
- an exact `width`;
- `readme: false`, for published folders like `web/public/`.

## Open

- **Next production round, on request from Front-end:** more widths or AVIF, cut-out portraits per figure, and the diverge and studio reshoots.
