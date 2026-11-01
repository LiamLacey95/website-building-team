# Creativity, interest and polish: scored rubric (Gates 2, 3, 4)

Use this whenever a project's success measure includes how creative, interesting or polished the work is. For how-it-works it is *the* measure (Gate 1 decision, Q3). This rubric does **not** replace the quality bar. Accessibility, performance, licences and the Impeccable detector still pass or fail on their own in G2.md to G4.md. A beautiful site that fails WCAG is a REVISE, and an accessible site that bores is a REVISE too.

## Reference point: Awwwards

Awwwards' jury scores sites on four criteria with fixed weights: **Design 40%, Usability 30%, Creativity 20%, Content 10%** (https://www.awwwards.com/about-evaluation/). Scores run out of 10, and the three jury scores furthest from the average are discarded. Sites scoring **6.5 or more** get an Honourable Mention. Site of the Day goes to the highest-scored, and a separate developer jury gives a Developer Award above 7 (Semantics/SEO, Animations/Transitions, Accessibility, WPO, Responsive Design, Markup/Meta-data).

- **Example:** Igloo Inc (Site of the Day, 23 Jul 2024; one of Awwwards' Sites of the Year 2024) scored Design 8.05, Usability 7.50, Creativity 8.31, Content 7.91, for 7.92 overall (https://www.awwwards.com/sites/igloo-inc).
- **Our axes and weights:** we keep Awwwards' four axes and add **Polish and craft** as its own axis. Polish is half of what our human asked for, and Awwwards folds it into Design. Our weights put creativity first, because that's the success measure. Each report also gives the **Awwwards-weighted** figure, so scores can be compared with real jury results.

| Axis | Our weight | Awwwards weight | What it asks |
|---|---|---|---|
| D. Design | 20% | 40% (Design) | Is it beautiful and intentional? Composition, type, colour, imagery, hierarchy |
| C. Creativity and originality | 25% | 20% | Is there an idea here nobody else has? Would a designer stop and look? |
| S. Content and storytelling | 20% | 10% (Content) | Does it say something worth saying, in a voice, with a shape (start, build, payoff)? |
| P. Polish and craft | 20% | in Design | Detail, transitions, edge states, consistency: does it feel finished everywhere? |
| U. Usability | 15% | 30% | Can everyone find, read, operate and understand it, on any device, with or without motion? |

**Weighted score** = 0.20·D + 0.25·C + 0.20·S + 0.20·P + 0.15·U. **Awwwards-weighted** = 0.40·(D+P)/2 + 0.30·U + 0.20·C + 0.10·S.

## Anchors

Score 1 to 10 on each axis. Use the anchors, and give **one piece of evidence per score**: a screenshot path, a section, an interaction or a quote. A score without evidence doesn't count.

### D. Design
- **4:** Competent template. Default type scale, safe palette, everything centred; it could be any product. Nothing is wrong, and nothing is chosen.
- **7:** A clear visual system: a distinctive type pairing used with a real scale, a palette with a point of view, deliberate composition and whitespace, and imagery that belongs to the brand. Consistent across pages.
- **9:** Unmistakable. You could identify the site from a 200 px crop. Composition takes risks that pay off (scale contrast, grid breaks, considered asymmetry), and type and image work as one. Every section looks art-directed, not assembled.

### C. Creativity and originality
- **4:** Familiar patterns in the familiar order: hero, three feature cards, testimonial, CTA. Any "creative" touch is a library effect seen elsewhere (parallax, a fade-in on every block).
- **7:** At least one idea specific to this subject. The form explains the content (for example, the page *is* the process it describes). One or two moments you haven't seen in this category.
- **9:** A concept that makes people share the link. The central idea is new or newly applied, carried through the whole site rather than one hero trick, and it would be hard to reskin for another brand.

### S. Content and storytelling
- **4:** Feature-list copy and generic claims ("seamless", "powerful"). No order to the information beyond the template's. Could be lorem ipsum with nouns swapped in.
- **7:** A narrative arc: hook, escalation, payoff, next step. Copy has a voice and concrete specifics, and every section earns its place. The reader learns something they'll remember.
- **9:** You read to the end because you want to. The structure carries surprise and pacing, the words and visuals tell the same story, and the closing beat lands. Quotable lines.

### P. Polish and craft
- **4:** Rough edges in plain sight: layout jumps, inconsistent spacing or radii, default focus rings next to custom ones, broken hover states, loading flashes, clipped text at some width. Transitions missing or abrupt.
- **7:** Finished on the main path. Motion has consistent easing and durations, and hover, focus and active states exist and match. Images are cropped per breakpoint, and loading, empty and error states are designed. Mobile looks designed, not merely stacked.
- **9:** Finished everywhere, including the places nobody checks: 404, slow network, reduced motion, keyboard focus, the last item in a list, long words, 320 px. Micro-interactions reward attention, and nothing jitters. The reduced-motion version is a designed version, not a broken one.

### U. Usability
- **4:** You have to work it out. Scroll-jacked or gesture-only navigation, content hidden in canvas with no text equivalent, low contrast, no reduced-motion path, heavy load before anything appears, and serious axe violations.
- **7:** Native scrolling or a fully accessible alternative; clear navigation and wayfinding (where am I, how far left); WCAG 2.2 AA on the main path; motion respects `prefers-reduced-motion`; fast first paint on mobile; works with keyboard.
- **9:** Effortless for everyone. Inventive and still obvious. Every set piece has a keyboard, screen-reader and reduced-motion equivalent that is just as good, and it is fast on a mid-range phone.

**Floor rules:**
- A serious or critical axe violation on the main path caps U at 6.
- No reduced-motion handling for significant motion caps U at 5, and caps P at 7.
- A hero tell (next section) caps D at 6.

## Memorability check (required)

Write the **one sentence a visitor would say to a friend** about the site, then judge it.

- **Pass:** it names something specific to *this* site ("you scroll and an igloo builds itself out of floating blocks"; "you can take a mechanical watch apart in your browser").
- **Fail:** it could describe many sites ("it's a clean modern landing page", "nice gradients"), or you can't write one.
- A fail caps C at 5, whatever the other scores.

At G2 and G3, write it for each direction or variation. If two of them get the same sentence, they aren't distinct enough (a G2 or G3 finding).

## AI-generic tells to penalise

These come from Impeccable's detector (run from `tools/`: `npx impeccable detect --json <path or url>`; rule list: `npx impeccable detect --list-rules`). The detector has two categories: **slop** (AI-default tells, 31 rules) and **quality** (craft defects, 31 rules). Check the slop families by eye as well, because the detector only sees what is rendered or in the source.

| Family | Detector rules (slop) | Penalty |
|---|---|---|
| Typography defaults | `overused-font`, `flat-type-hierarchy`, `gradient-text`, `italic-serif-display`, `oversized-h1`, `extreme-negative-tracking` | −1 C per family present (max −3 C in total across families) |
| Glow and colour defaults | `ai-color-palette`, `cream-palette`, `dark-glow`, `radial-halo`, `radial-spotlight-glow` | |
| Component and layout defaults | `side-tab`, `border-accent-on-rounded`, `nested-cards`, `icon-tile-stack`, `hero-eyebrow-chip`, `kicker-above-heading`, `monotonous-spacing`, `marquee`, `pulsing-dot` | |
| Copy defaults | `marketing-buzzword`, `aphoristic-cadence`, and advisory `em-dash-overuse`, `theater-slop-phrase` | −1 S if present in headings or hero copy |
| Advisory decoration | `bounce-easing`, `blinking-cursor`, `shape-assembled-illustration`, `gpt-thin-border-wide-shadow`, `repeating-stripes-gradient`, `codex-grid-background`, `numbered-section-labels` | note only, unless three or more |

- **In the hero:** a slop tell **in the hero or first viewport** caps D at 6.
- **Justified tells:** a tell justified in `DESIGN.md` or the variant file is not penalised if the justification holds up (G3.md).
- **Quality findings** (`low-contrast`, `text-overflow`, `tight-leading` and so on) are penalised under P or U as craft defects, not as slop.

**The detector is necessary, not sufficient.** In calibration, Bootstrap's stock "Product" example had **zero** slop findings and still scored 2.9, because generic doesn't always look like AI. A clean detector run proves the absence of tells. It doesn't prove creativity.

## How to score

1. **Score before reading the team's self-assessment** (variant files, critique notes), then compare. Where you differ by 2 or more on an axis, say why.
2. **Use the real thing, not the screenshots, from G3 on.**
   - Interact at 390 and 1440 px, with keyboard only, with `prefers-reduced-motion: reduce`, and on a throttled connection (`node lighthouse.mjs` for numbers).
   - Screenshots are evidence, not the experience.
3. **Optional second opinion:** `/impeccable critique <target>` on one section. Record where it agrees with you or not; it doesn't change your score.
4. **Report format** (in the gate review):

```
Creativity scorecard: <direction or variation>
| Axis | Score | Evidence |
| D | 7 | style tile: type pairing X/Y at 1:3.2 scale; hero composition breaks the grid (screenshots/…-1440.png) |
| C | … | … |
| S | … | … |
| P | … | … |
| U | … | … |
Weighted: 7.2 · Awwwards-weighted: 6.9 · Memorability: "…" (pass) · Tells: none / <families> (−n)
Biggest lift available: <the one change that would raise the score most>
```

## Per gate

| Gate | What exists | Score | Bar to recommend |
|---|---|---|---|
| **G2** directions | Style tiles, key art, moodboard, the set-piece concept in words or a storyboard | D, C and S **as potential**, P on the artefacts themselves; U as a **risk note** (what could make it hard to use) | Recommended direction: C ≥ 7 and D ≥ 7 as potential, memorability passes, no tells in the key art or tile. All three directions must differ in their memorability sentence |
| **G3** variations | Running home and key interior page per variation | All five axes on the running variants | Recommended variation: weighted ≥ 7.0, no axis below 6, memorability passes. Show the scores side by side; a variation that is safest but scores lowest on C should not be recommended without saying so |
| **G4** release | The whole site | All five axes, plus P checked on edge states (404, slow network, reduced motion, keyboard, 320 px, long content) | Weighted ≥ 7.5, P ≥ 8, U ≥ 7, memorability passes. Below this, the verdict is REVISE, with the "biggest lift" list as the fix order. For context, an Awwwards Honourable Mention starts at 6.5 on its own weights |

## Calibration (2026-11-01)

These scores come from screenshots at 1440 and 390 (top plus three scroll depths), a reduced-motion frame, axe, script weight and the Impeccable detector. Full notes are in `projects/how-it-works/reports/05-review-creativity-rubric-review.md`. No third-party screenshots are committed.

| Site | D | C | S | P | U | Weighted | Awwwards-weighted | Real Awwwards |
|---|---|---|---|---|---|---|---|---|
| Ciechanowski, "Mechanical Watch" (acclaimed interactive explainer) | 7 | 9 | 10 | 9 | 7 | **8.5** | 8.1 | n/a |
| Igloo Inc (Site of the Day 2024, Site of the Year 2024 list) | 9 | 9 | 6 | 8 | 5 | **7.6** | 7.3 | 7.92 |
| Lusion (studio site, multiple awards) | 8 | 8 | 6 | 7 | 6 | **7.1** | 7.0 | n/a |
| Bootstrap "Product" example (deliberately bland) | 3 | 1 | 1 | 4 | 7 | **2.9** | 3.8 | n/a |
| `fixtures/slop.html` (deliberately AI-generic) | 3 | 2 → 1 | 1 | 3 | 4 | **2.3** after tell penalties (2.5 before) | 2.7 | n/a |

My Awwwards-weighted score for Igloo (7.3) is 0.6 below its real jury score (7.92). Almost all of the gap is Usability: I scored 5 against the jury's 7.5, because this rubric weighs scroll-jacking, canvas-only content and the missing reduced-motion path more heavily than the jury did. That is deliberate, since our quality bar is WCAG 2.2 AA.
