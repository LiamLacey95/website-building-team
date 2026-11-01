# Review: Gate 3, design selection (how-it-works)

Brief: `projects/how-it-works/briefs/08-review-gate3.md` · Checklists: `docs/review/checklists/G3.md`, `creativity.md` · Reviewer: Review · 2026-11-01

Verdict: **PASS WITH NOTES.** I recommend **C · table**.

| Variation | Weighted | Awwwards-weighted | Meets the G3 bar? |
|---|---|---|---|
| **C · table** | **7.85** | **7.9** | Yes |
| A · long run | 7.05 | 6.8 | Yes, just |
| B · stations | 6.65 | 6.4 | No: Usability 5 |

One MAJOR is shared by all three: the `<pre>` blocks scroll horizontally but can't be reached by keyboard. It's a one-attribute fix for Phase 5 and doesn't affect the choice.

## Scope

I scored the **live preview builds** on :4321, :4322 and :4323 (home and `/setup/`) before reading the variant records or Front-end's report.

- **Live checks:**
  - scroll frames at 390, 768, 1440 and 1920 px;
  - a reduced-motion pass and a no-JS pass;
  - a 30-stop keyboard pass (every focus stop had a visible ring and was on screen);
  - operating the gates: "Lift the barrier", "Run it without humans", B's Next/Previous/arrow keys, and C's "Drop the marble", open-a-station and "Back to the table";
  - console errors and 4xx requests.
- **Tools** (output in `projects/how-it-works/review/out/g3-*`):
  - `a11y.mjs`: 6 URLs at 4 widths;
  - `lighthouse.mjs --runs 3` on the three homes (preview builds, mobile preset);
  - Impeccable `detect` on each live page at 1280 and 390 px;
  - `licences.mjs` on `web/public/assets/generated/`.
- **CSP:** a static scan of the built HTML against the strict CSP in `vercel.json`.
- **Images:** all 11 production station, gate and landing images in a montage, and the four gate hands at 100%.

Screenshots from this review aren't committed; Front-end's `screenshots/g3/` is the record.

## Scorecards

### C · table (`:4323`): recommended

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | The whole run as one sky-blue tabletop with a birch rim: the double diamond in mint, the track, four striped crossings, station portholes and the cup. It's a distinctive information graphic and unmistakable from any crop (home at 1440). Opened stations use a large image plus a headline. The portholes are small (about 70 px) |
| C | 9 | The most original of the three, and the one that best fits "how it works". The process is a board you can see whole and play: "Drop the marble" rolls it along the track, "Run it without humans" sends it past every crossing, and any station opens in place. You can't reskin it for another brand |
| S | 7 | Comprehension at a glance (the whole process on one screen), then depth on demand. "Read it in order" and "Next: Define" give a path. Pacing is weaker than A's continuous story, and there's no "second opinion" dialogue beat |
| P | 7 | Focus management is the best of the three: opening a station focuses its `h2`, and "Back to the table" returns focus to the link you came from. Minuses: "Build and review" and "Your turn" collide at 390; one of three Lighthouse runs measured CLS 0.268 (median 0); without JS the table loses its station markers |
| U | 8 | Performance **96**, LCP 1.29 s, TBT 83 ms, JS 6 KB. **axe: 0 violations on home at all 4 widths.** Short page, no overflow at any width, native scroll, full text without JS |

**Weighted 7.85 · Awwwards-weighted 7.9.**
- **Memorability:** "The whole process is a marble run on one table: you drop the marble, open any station, and if you run it without humans it skips all four decisions." Pass.
- **Detector:** only `hard-offset-shadow` (17, the documented toy shadow).
- **Hypothesis held:** "Play first beats scroll first for memorability." It did. It's the only variation where the first screen *is* the explanation.

**Top three changes for Phase 5:**
1. **Bigger, more legible stations on the table.** Grow the portholes (about 110 px at 1440), fix the 390 label collision, and render the station markers in HTML so the map works without JS.
2. **Borrow A's story depth inside opened stations.** Bring in A's gate cards ("What you see" and "Your options") and its invented "second opinion" exchange (Gate 1 Q5 allows made-up quotes). Give each opened station B's full-bleed stage image. That lifts S from 7 to 8 at no cost to the concept.
3. **Make "Drop the marble" pay off.** Let the marble pause at each crossing and light the station it passes, so playing the run also tells it. Stabilise the CLS outlier (reserve the size of the table area).

### A · long run (`:4321`)

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | A consistent art direction: one track runs the whole length through sky-blue gate bands, with alternating cards and station art, and a sticky gate rail with barrier pills |
| C | 7 | The concept as specified (a scroll-driven marble down a long track), executed well. But structurally it's a long-scroll explainer, a familiar format |
| S | 8 | The deepest story: a full narrative with gate cards (what you see, your options), the "A second opinion" Review/Front-end/Backend exchange, and the run-without-humans card listing the four skipped decisions. 18,000 characters on the page |
| P | 6 | **Horizontal overflow at 390 px** (17 px, from the gate-rail labels and inline `code`). axe serious on 10 `<pre>` nodes at 390. In the run-without-humans state the rail marble is clipped at the right edge |
| U | 6 | Lighthouse performance **68** with **TBT 5.4 s** on the mobile preset (range 4.1 to 6.7 s): the scroll-path work is heavy on mid-range CPUs, though there are only 7 KB of JS. The page is 25,000 px tall (32,800 at 390). Keyboard, focus, reduced motion and no-JS are all good |

**Weighted 7.05 · Awwwards-weighted 6.8.**
- **Memorability:** "A marble rolls down a very long page and you lift each barrier as you reach it." Pass.
- **Hypothesis ("one unbroken track makes the process physical"):** held. But the price is length and main-thread cost.

**Top three changes:**
1. Cut TBT: throttle and cache the path maths, and skip work for off-screen segments.
2. Fix the 390 overflow and the `<pre>` keyboard access.
3. Shorten it by about 30% by moving detail into collapsible gate cards.

### B · stations (`:4322`)

| Axis | Score | Evidence |
|---|---|---|
| D | 8 | The most cinematic: a full-bleed stage per station with a white card over it, and a little track and marble along the bottom |
| C | 6 | The format is a slide deck (Previous, "Station n of 11", Next). The gate rule ("Next (barrier still down)" is disabled until you lift the barrier) is a real mechanic, but the frame is familiar |
| S | 7 | One idea per station with tight pacing, but each screen shows little (868 characters visible at a time). Images are reused: station 3 ("Six threads") crops the cast to three figures behind the card, and the finale shows the same crop again |
| P | 7 | Polished per screen. At 390 the bottom bar collides: the station label is cut off and Next overlaps the dots |
| U | 5 | **LCP 4.37 s, over budget** (performance 85). **axe serious `target-size`** on the station dots at 390 and 768 (8 and 11 nodes). Content is paged out of the document, and you can't continue past a gate without operating it. Arrow keys and `#hash` deep links work, and no-JS falls back to one long readable page (good) |

**Weighted 6.65 · Awwwards-weighted 6.4. Doesn't meet the bar** (U 5).
- **Memorability:** "A slideshow where Next stays locked until you lift the barrier." Pass, but generic.
- **Hypothesis ("framed shots read as more polished and cinematic"):** held for the look, and cost usability and story depth.

**Top three changes, if it were taken forward:**
1. Fix the LCP: preload and size the first stage image.
2. Make the station dots at least 24 px.
3. Shoot or crop a stage per station instead of reusing the cast plate.

## Hybrid

**C, with A's gate cards and dialogue and B's stage images in its opened stations,** would beat all three. My estimate is 8.2 or more weighted: S rises from 7 to 8 and P from 7 to 8 once the table polish lands. These are all additions to C's structure, not a change of it, so recommending C loses nothing. Of the three, A's long scroll is the only element I wouldn't carry over.

## Checklist results

| Check | A | B | C |
|---|---|---|---|
| axe, home (4 widths) | serious ×1 at 390 (`scrollable-region-focusable`, 10 `pre` nodes) | serious `target-size` at 390 and 768 | **0** |
| axe, `/setup/` | serious `scrollable-region-focusable` at 390 and 768 (shared) | same | same |
| Keyboard (30 stops) | All focus rings visible; skip link first; gates operable | Same; focus stays on Next after paging | Same; best focus return |
| Reduced motion | Static, barriers drawn lifted | Station frame kept | Barriers drawn raised; static board |
| No JS | Full story (19,500 characters) | One long page (19,600) | Full text, but the table loses its station markers |
| Overflow | **390: +17 px** | Off on load (the marble overshoots after paging) | None |
| Lighthouse mobile (median of 3) | Perf 68 · LCP 1.15 s · **TBT 5.4 s** · CLS 0 | Perf 85 · **LCP 4.37 s** · TBT 0 · CLS 0.048 | Perf **96** · LCP 1.29 s · TBT 83 ms · CLS 0 (one run 0.268) |
| JS transferred | 7 KB | 6 KB | 6 KB |
| Detector (slop) | 0 (`hard-offset-shadow` ×66, justified) | 0 (×6) | 0 (×17) |
| CSP | No inline scripts, `<style>` blocks or `style=` attributes in the built HTML, so it's compatible with the strict `vercel.json` header (`script-src 'self'; style-src 'self'`). The preview server doesn't send that header, so check it again on the Vercel preview at G4 | same | same |

### G2 findings: status

| G2 finding | Status |
|---|---|
| Cast inconsistent in 4 of 9 images (MAJOR) | **Fixed.** All 11 production station, gate and landing images use the six-figure cast (body-colour faces, smiles, one prop each); the hero shows the six (`62ba09d`) |
| Front-end and Review shared one red | **Fixed:** orange (Front-end) versus red (Review) |
| C's `on-accent` on tomato at 3.87:1 | **Fixed** in tokens (`6f3c8d9`); axe finds no contrast violations on any page |
| Style frames with fake text | **Fixed:** none are in `web/public/assets/generated/` |
| "Wait at the gate" and "run without humans" not spiked | **Fixed:** built and working in all three; Front-end reports 3 engines with motion on and reduced |

### Images and licences

- **Hands:** gates 1 to 4 pass at 100%.
  - Gates 2 and 4 are thumb-and-index pinches with plausible nails and the middle finger behind.
  - Gate 3 curls the hand around the barrier, with the thumbnail visible and the fingers folded.
  - No extra, fused or bent digits.
- **Fake text:** none in any shipped image.
- **Licences:** `licences.mjs` finds **18 images, 18 sidecars, 0 fail**. All are FLUX Klein (NOTE), covered by Gate 1 Q11 A.

## Findings for Phase 5 (on C unless stated)

- **[MAJOR] Keyboard access to scrollable code blocks (all three, shared component).** axe flags serious `scrollable-region-focusable` on `/setup/` at 390 and 768 (and on A's home). Give overflowing `<pre>` elements `tabindex="0"` with an accessible name (for example `role="region" aria-label="Command"`), or let them wrap.
- **[MINOR] Labels collide at 390:** "Build and review" overlaps "Your turn" on the table.
- **[MINOR] No-JS table:** station markers and labels are missing without JS. Render them in HTML (they're links), so the map works as navigation without scripts.
- **[MINOR] CLS outlier:** 0.268 in one of three runs. Reserve the table's size (aspect-ratio) and the image boxes.
- **[MINOR] Favicon:** `/favicon.ico` and `/favicon.svg` return 404 on all three (the console error).
- **[MINOR] Small portholes:** about 70 px station images on the table read as decoration. Enlarge them (Top 1 above).
- **[NIT] Ordering:** the table's intro paragraph ("Paste it into Claude Code…") sits below the board. Move it next to the setup sentence so the CTA's explanation isn't separated from it.

## Ranking and recommendation

1. **C · table, 7.85.** Recommended, with the hybrid additions above.
2. **A · long run, 7.05.** Meets the bar narrowly. It has the best story but the heaviest page.
3. **B · stations, 6.65.** Below the bar on usability.

**Front-end's self-assessment:** Front-end estimated A 6.45, B 6.55 and C 6.05, on first builds before the fixes and the production imagery. My scores differ by 2 or more on C's D (6 to 8), P (5 to 7) and U (6 to 8). The fixes landed most strongly in C: the sky tabletop, the gate cues and the mobile rails. C's live build now has the best performance and the cleanest axe result of the three, so I'm confident the ranking reflects the current builds.
