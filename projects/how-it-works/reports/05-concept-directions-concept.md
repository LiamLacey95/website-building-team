# Report 05-concept-directions (Concept)

State: DONE. There are three genuinely different directions for Gate 2, each with a signature set piece, an "explain by playing" device, generated imagery with provenance, a style tile and a memorability sentence. There is also a combined contact sheet.

## Deliverables

| | A · Paper Trail | B · Signal Path | C · Marble Run |
|---|---|---|---|
| Direction | `concepts/a-paper-trail/direction.md` | `concepts/b-signal-path/direction.md` | `concepts/c-marble-run/direction.md` |
| Style tile | `concepts/a-paper-trail/style-tile.html` | `concepts/b-signal-path/style-tile.html` | `concepts/c-marble-run/style-tile.html` |
| Images | `concepts/a-paper-trail/images/` | `concepts/b-signal-path/images/` | `concepts/c-marble-run/images/` |
| Hero line | One sentence went in. A website came out. This is the paper trail. | Input: one sentence. Output: this website. Follow the signal. | We dropped one sentence in at the top. Watch where it rolls. |

- **Contact sheet:** `concepts/contact-sheet.html`.
- **Fonts:** `concepts/_fonts/`, with eight OFL families, self-hosted latin subsets and `FONTS-LICENCE.md`.

## The three ideas

| | World | The prompt is | The team are | A gate is | The double diamond is | Explains by |
|---|---|---|---|---|---|---|
| **A** | a studio desk seen from above (green leather blotter) | a sheet of paper | six tools | a rubber stamp you press | pencil on tracing paper | lifting the tracing paper (brief vs. result) |
| **B** | a modular instrument at night | an amber signal | six rack modules | a guarded toggle switch | the signal's envelope on an oscilloscope | pulling Review's cable (what would have shipped) |
| **C** | a clay-and-wood marble run on a yellow wall | a glass marble | six clay figures | a level crossing a *real human hand* lifts | the shape of the track | "Run it without humans" (the marble flies off the table) |

**Memorability sentences, all different:**

- **A:** "You stamp the four human decisions yourself with a rubber stamp, and when you reach the bottom every page you scrolled past gets bound into a book."
- **B:** "It's built like a synthesiser: your sentence travels as a signal through six modules, it won't pass a gate until you flip the switch, and you can pull Review's cable to see the bugs that would have shipped."
- **C:** "A glass marble rolls down the whole page through a clay marble run, a real human hand has to lift each barrier, and if you take the barriers away the marble flies straight off the table."

## Against Review's creativity rubric

These are my self-assessments as *potential*. Review scores independently. Every direction:
- has a memorability sentence that names something only this site does;
- has an interactive explanation device, the Ciechanowski layer, because Review's calibration found award sites weakest on storytelling;
- avoids the slop families: the detector finds zero slop findings in all three tiles and the contact sheet.

| | D | C | S | P (artefacts) | U risk | Notes |
|---|---|---|---|---|---|---|
| A · Paper Trail | 8 | 7-8 | 8 | 8 | low | The calmest and most literate. The binding finale and stamp must delight, or it is "only" tasteful |
| B · Signal Path | 8-9 | 8 | 8 | 8 | medium-high | The most cinematic art direction, closest to Igloo-level. Highest build cost; a dark UI shows every flaw |
| C · Marble Run | 8 | 9 | 8-9 | 8 | medium | The most original and shareable. "Run it without humans" is the strongest single explanation moment, and the hand-on-the-barrier image *is* the product's promise |

**Concept's recommendation for the PM's gate README: C · Marble Run.** It has the highest creativity potential and the best memorability. The main risk, cast consistency, is shown to be solvable in this round: the cast sheet came out consistent, and WEB2 edits fixed details without changing the figures. B is a close second if the human prefers a darker, more "premium" register and accepts the higher build cost. A is the safe choice. The shared "wear the other two" Gate 2 moment works with any of them.

### Picks (26 images, 8-9 per direction, all with sidecars)

| Direction | Key art | Character sheet | Chapters | Style frames | Texture |
|---|---|---|---|---|---|
| A | `a-hero` | `a-tools` (six tools) | `a-discover`, `a-concept`, `a-gate`, `a-book` | `a-frame-home`, `a-frame-chapter` | `a-texture` (leather) |
| B | `b-hero` (WEB2 clean-up) | `b-modules` (six modules) | `b-scope`, `b-gate` (WEB2 clean-up), `b-converge` | `b-frame-home`, `b-frame-chapter` | `b-texture` (brushed metal) |
| C | `c-hero` | `c-cast` (six clay figures, WEB2 flag fix) | `c-hand`, `c-research`, `c-diverge`, `c-studio` | `c-frame-home`, `c-frame-chapter` | `c-texture` (painted wall) |

- **Provenance:** each `images/README.md` lists workflow, model, seed and alt text, and each `.json` sidecar carries the full API graph for `--replay`.
- **Upscaled heroes:** 2x masters of the three heroes were made with WEB6b (RealESRGAN) and kept in `artgen/output/how-it-works/*/_ship/` for the Build phase.
- **About 75 images generated in total.** The rejects stay in `artgen/output/` (git-ignored).

**Image checks done before Review's:**
- no readable text in any non-frame image;
- style frames labelled as mood images;
- no brand marks;
- three details fixed with WEB2 edits:
  - printed glyphs on B's faceplates;
  - a mark on B's switch lever;
  - C's red-white-red flag, which read as a national flag.

### Style tiles and tokens

- **Each direction has a `style-tile.html` and a `tokens.css`.** The tokens share one schema scoped by `data-theme` (`paper-trail`, `signal-path`, `marble-run`), as the PM asked for Front-end's theme switcher.
- **Each tile demonstrates the set piece in CSS:**
  - A: the pencil-drawn diamond and a working stamp;
  - B: the oscilloscope trace, a guarded switch and "Unplug Review";
  - C: a marble on `offset-path`, a lifting barrier and "Run it without humans".
- **Playwright checks at 1440 and 390 px and with `prefers-reduced-motion`:** no broken images, all fonts loaded, no horizontal overflow, no console errors.
- **Detector:**
  - zero findings for A, B and the contact sheet;
  - C has only the deliberate `hard-offset-shadow` toy shadows, documented in `direction.md`.

## What I tried and dropped

- **Cream and paper page backgrounds** for A and C. The detector's `cream-palette` rule flags a warm off-white page as the default AI surface. A became a deep green leather blotter, with paper only as sheets on it. C became a sunflower-yellow wall. Both are stronger than the originals, and A's green hero is the best image in the set.
- **Fraunces** for A's display. It is on the `overused-font` list, and an italic Fraunces hero is the `italic-serif-display` tell. It was replaced by Young Serif, set roman.
- **Mono kicker labels above headings** (all three tiles), **numbered section labels**, B's **blinking input cursor**, B's **amber glow** on lamps, and C's **spring/bounce easing**. All are named detector tells. Replacements:
  - labels sit beside parts, and there are no section numbers;
  - B's input is a real editable field (which became the "type your own idea" feature);
  - lamps are solid with a specular dot;
  - C's easing follows gravity.
- **The first batch's oak-desk plates (A) and cream-backdrop images (C):** reshot on the new backgrounds so each world is consistent. I stopped the cream C images mid-batch to save GPU time.
- **Ruler markings:** Klein draws pseudo-digits on rulers, so A's prompts now ask for a plain brass straightedge.
- **A stamp with a star:** both seeds of the first gate stamp put a red star in the rings, which can read as a political symbol. It was regenerated as plain concentric rings.
- **Research's fourth candidate, "Studio Floor" (isometric cutaway):** not taken forward. Research flagged it as the riskiest for consistent imagery, and C covers the same "follow a character through rooms" pleasure with a stronger single idea and a far smaller cast problem.

## Process notes

- **GPU check:** before the first batch, 2.6 GB of VRAM was in use. All Klein-full work ran as one model family, then the distilled Klein jobs (textures, WEB2 cleanups).
- **Server mishap:** stopping a background batch also stopped the ComfyUI server it had started, which failed the parallel batch. Fixes:
  - I now start the server separately (`generate.py --start`);
  - `generate.py` now prints a clear "ComfyUI stopped responding" message instead of a traceback (kit fix, committed with this work).
- **Kit additions:** `artgen/tools/export_picks.py` exports picks to WebP with their full provenance sidecar plus alt text, and writes each `images/README.md`; it will also be the production-asset exporter in Build. `artgen/tools/make_seamless.py` makes unevenly lit textures tile properly (lighting flatten plus a separable half-offset cross-fade). WEB5 alone left a visible cross on the leather, metal and wall textures, so the textures here were made with WEB1 (distilled Klein) plus this tool. Improving WEB5 itself is a kit follow-up.
- **Detector:** Impeccable `detect` on all three style tiles finds zero slop findings in A and B. C has only `hard-offset-shadow` quality notes; its toy look is deliberate and documented in the direction. Contrast issues the detector found were fixed: vermilion on manila became a deeper `#8F2412`, and B's tiny tracked labels were enlarged.

## Needs

Nothing. The PM assembles the Gate 2 packet; Review scores the directions against `docs/review/checklists/creativity.md`.
