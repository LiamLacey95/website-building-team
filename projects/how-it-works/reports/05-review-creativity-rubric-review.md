# Report 05-review-creativity-rubric (Review)

Status: DONE. The creativity rubric is written, wired into G2, G3 and G4, and calibrated on five sites.

## Deliverables

| # | Deliverable | Path |
|---|---|---|
| 1 | Scored rubric: 5 axes, 1 to 10 each, with 4, 7 and 9 anchors per axis; memorability check; AI-generic tells; per-gate bars | `docs/review/checklists/creativity.md` |
| 2 | Wired into the gates | `G2.md` (new "Creativity score" section), `G3.md` (new section, and the 1-to-5 scorecard replaced by a 1-to-10 table on the rubric's axes), `G4.md` (new §5b; the verdict rule now requires §5b) |
| 3 | Calibration | Below, and the table at the end of `creativity.md` |

## Design decisions

- **Axes:** Design, Creativity and originality, Content and storytelling, Polish and craft, Usability. Awwwards' four criteria (Design 40%, Usability 30%, Creativity 20%, Content 10%; https://www.awwwards.com/about-evaluation/) plus **Polish** as its own axis, because the human's measure names it.
- **Two weightings:**
  - **Ours**, with creativity first (D 20, C 25, S 20, P 20, U 15), which is the success measure.
  - **Awwwards-weighted**, which uses the jury's weights and makes our numbers comparable with real awards.
- **Guardrails against vibes:**
  - one piece of evidence per score, or the score doesn't count;
  - score before reading the team's self-assessment;
  - floor rules: a serious axe violation caps U at 6; no reduced-motion path caps U at 5 and P at 7; a hero AI tell caps D at 6; a failed memorability check caps C at 5.
- **Quality bar unchanged:** accessibility, licences, performance and the detector still pass or fail on their own. The rubric adds a bar and doesn't trade against them.
- **Per-gate bars:**
  - G2 recommended direction: C ≥ 7 and D ≥ 7 as potential.
  - G3 recommended variation: weighted ≥ 7.0 with no axis below 6.
  - G4: weighted ≥ 7.5, Polish ≥ 8 and Usability ≥ 7.
  - For context, an Awwwards Honourable Mention starts at 6.5.

## Calibration

**Method.** For each site I took:
- Playwright screenshots at 1440 px (top and three scroll depths) and at 390 px;
- a frame with `prefers-reduced-motion: reduce`;
- axe (WCAG 2.2 AA tags), script transfer size, and whether the CSS has a `prefers-reduced-motion` rule;
- Impeccable's detector on the live URL.

**Limits.** I didn't play each site end to end by hand, so interaction scores rest on frames plus the published behaviour. The screenshots are third-party content and are **not committed** (as decided in Gate 1 Q10). They were kept in a temporary folder and deleted.

| Site | D | C | S | P | U | Ours | Awwwards-weighted | Real Awwwards | Memorability sentence |
|---|---|---|---|---|---|---|---|---|---|
| Ciechanowski, "Mechanical Watch" (ciechanow.ski/mechanical-watch) | 7 | 9 | 10 | 9 | 7 | **8.5** | 8.1 | n/a | "You can take a mechanical watch apart in your browser, one gear at a time." Pass |
| Igloo Inc (igloo.inc; Site of the Day 23 Jul 2024, on Awwwards' 2024 Sites of the Year list) | 9 | 9 | 6 | 8 | 5 | **7.6** | 7.3 | **7.92** | "You scroll and an igloo assembles itself out of floating ice blocks." Pass |
| Lusion (lusion.co; studio with multiple awards) | 8 | 8 | 6 | 7 | 6 | **7.1** | 7.0 | n/a | "Squishy 3D jacks you can push around." Pass, just about |
| Bootstrap 5.3 "Product" example (deliberately bland) | 3 | 1 | 1 | 4 | 7 | **2.9** | 3.8 | n/a | None possible. Fail |
| `docs/review/tools/fixtures/slop.html` (deliberately AI-generic) | 3 | 1 (2 minus tells) | 1 | 3 | 4 | **2.3** | 2.7 | n/a | "Purple gradient SaaS page." Fail |

### Evidence per site

**Mechanical Watch**
- **D 7:** plain blog chrome (blue header, a single text column) around exceptional diagrams.
- **C 9:** every concept has its own interactive, draggable model with sliders, and the form *is* the explanation.
- **S 10:** a gradual build from mainspring to escapement, with colour-coded terms in the prose matching the parts in the diagrams.
- **P 9:** consistent line style and colour coding across dozens of figures.
- **U 7:** native scroll, it reads well at 390, and drag has slider alternatives. But axe flags **441 colour-contrast nodes** (the coloured term labels) and the detector flags 433 low-contrast findings, so U is held at 7. No reduced-motion CSS was found, though most motion is user-driven. 50 KB of JS.
- **Lesson:** this is the closest model for a "how it works" site. Acclaimed explainers can still fail contrast, which is why the quality bar stays separate.

**Igloo Inc**
- **D 9:** full-bleed real-time 3D snowscape, monospace UI and an ice palette; unmistakable from any crop.
- **C 9:** blocks fly apart and reassemble as you scroll; data labels are drawn on the blocks.
- **S 6:** the story is thin: a short manifesto ("consumer brands at the intersection of Community, AI, and crypto").
- **P 8:** text scrambles in as it decodes; the mobile capture caught it mid-scramble, which is deliberate. It has a sound toggle, but the first frame is a bare scene before the UI loads.
- **U 5:**
  - the page height is fixed at 900 px, so scrolling is hijacked and the content lives in a canvas;
  - no `prefers-reduced-motion` CSS, and the reduced-motion frame looked the same;
  - 419 KB of JS;
  - axe found 0 violations, but most content isn't in the DOM.
- Detector: 0 findings.

**Lusion**
- **D 8:** confident type and a 3D hero of glossy jacks in blue, black and white.
- **C 8:** physics-driven 3D in the hero.
- **S 6:** studio boilerplate ("Bold Ideas, Brought to Life").
- **P 7:** the hero line was clipped mid-reveal in the first frame, and during scroll the canvas draws over the logo and header.
- **U 6:** scroll-hijacked (900 px document); axe found 2 critical (button-name), 1 serious link-name and 1 serious nested-interactive; no reduced-motion CSS; 298 KB of JS.
- Detector: skipped-heading ×2, content-hidden-at-rest, low-contrast.

**Bootstrap "Product"**
- **D 3, C 1, S 1:** the headline "Designed for engineers", then four panels saying "Another headline / And an even wittier subheading", with empty rounded rectangles where content goes.
- **P 4:** consistent, but empty.
- **U 7:** native scroll, responsive, has reduced-motion CSS, 25 KB of JS; axe found 2 contrast nodes.
- **Detector:** 0 slop findings (3 quality findings). This is the key calibration point: a clean detector run doesn't mean creative.

**Slop fixture**
- 26 detector findings in 10 rules, covering all three slop families (typography: gradient-text, overused-font; glow: dark-glow, ai-color-palette; components: side-tab, nested-cards, hero-eyebrow-chip) plus marketing-buzzword in the hero copy.
- The tell penalties take C from 2 to 1 and S stays at the floor. D was already below the hero-tell cap.

### What the calibration shows

1. **The scale separates what it should.** Award-level work lands at 7.1 to 8.5. Bland and AI-generic pages land at 2.3 to 2.9. There's nothing in between because I picked extremes. Our own variations should land in that middle band, and the G3 and G4 bars sit at 7.0 and 7.5.
2. **It tracks a real jury.** My Awwwards-weighted score for Igloo is 7.3 against the jury's 7.92. Almost all of the gap is Usability (my 5 against their 7.5): this rubric deliberately penalises scroll-jacking, canvas-only content and having no reduced-motion path, because our quality bar is WCAG 2.2 AA.
3. **The two axes the human cares about most diverge on real sites.** The award sites score high on D and C but only 6 on S, while the explainer scores 10 on S. For how-it-works the brief asks for both, so Concept and Front-end should aim for Igloo's art direction with Ciechanowski's storytelling.
4. **The detector is necessary, not sufficient** (the Bootstrap result), so the memorability check and the C anchors carry the creative judgement.

## For the PM

- `.team/roles/review.md` line 30 still describes the G3 scorecard as "1 to 5 on hierarchy, clarity, brand fit, accessibility, responsiveness". It should point to `docs/review/checklists/creativity.md` (1 to 10 on design, creativity, content, polish and usability). It's a one-line edit, and the role file is PM-owned.
- Suggestion: share `creativity.md` with Concept and Front-end now, so they know what Gate 2 and Gate 3 will be scored on. Point 3 above is the useful steer.

Needs: nothing else. My next review is Gate 2.
