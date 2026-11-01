# Variant A: long-run

Branch: `variant/how-it-works-g3-a-long-run` · Port: 4321 · Worktree: `<worktreesDir>/variant-how-it-works-g3-a-long-run`

## Hypothesis

**One unbroken journey makes the process feel physical.** This is Direction C's set piece as specified.
- One continuous wooden track runs down the whole story. The chapters sit beside it, and the glass marble rolls with the reader.
- At each of the four level crossings the marble **waits**, even while the page keeps scrolling, until the visitor lifts the barrier.
- "Run it without humans" takes every barrier away, and the marble races off the end into the bin.

**Structure.** One long page with three columns (text, lane, picture). The track is built in real pixels from the layout, so it fits every width. Each gate is a full-width band that the track runs through, beside the photographed hand.

## Persona served

**Maya** (agent-native builder) first:
- the process reads as mechanics, a machine she can watch run;
- "without humans" answers "do I lose control?" by demonstration.

**Sam** gets one obvious path from top to bottom, with a gate rail naming the four gates.

## Trade-off

- **Length.** It's the longest variation: about 21,000 px at 1440, and more on mobile.
- **Momentum over overview.** You see where you are (the gate rail, the marble), but not the whole run at once.
- **Rewards scrolling.** It suits readers who scroll; people who skim get less.
- **No interaction is required to read.** Every gate's text is in the page, and reduced motion shows the decisions.

## Impeccable

**Shape brief** (`/impeccable shape`). No live round was possible: the playbook routes questions for the human through the PM and the gates. The confirmed inputs were the PM's hypothesis in brief 07, Concept's set piece (approved at G2), `PRODUCT.md` and `DESIGN.md`.
- **Job and audience:** a first-time visitor from a shared link. Mode: Persuade, carried by a Read-style story.
- **Outcome:** they can name the four gates and they copy the setup sentence. The proof is real artefacts at each station.
- **Direction:** the track is the spine of the layout. The focal moment is the marble waiting at a lowered barrier. The counter-moment is the run without humans.
- **Scope:** home (all 10 chapters, 4 gates, the G2 re-skin, without-humans, reduced motion, no-JS) and `/setup/`.
- **Constraints:**
  - strict CSP (no inline anything);
  - motion is optional;
  - the marble is decorative (`aria-hidden`), and every gate is a real button with its result in text;
  - WCAG 2.2 AA.

**Commands run:**
1. `impeccable context --target web/src/pages/index.astro`
2. `shape` (the brief above)
3. Build: craft floor read; shared components on master; `src/scripts/long-run.ts` on the shared engine `src/scripts/run.ts`.
4. `critique`: Assessment A by an independent agent on the screenshots; Assessment B by `detect` on the URLs.
5. Fixes.
6. `detect` again.

**Critique, first build:** health 17/28. The estimated creativity score was **6.45** weighted (D 6, C 7, S 7, P 6, U 6), below the G3 bar. The top issues, and what changed:

| # | Issue | Change |
|---|---|---|
| P1 | The gates don't read as the set piece; the barrier on the track and the card's drawing are two separate things | Each gate is now a **full-width band**: the copy on the left, and a sky panel the real track runs through, with the striped boom on the track and the photographed hand beside it. The card's own drawn scene is off (`LevelCrossing scene={false}`) |
| P1 | Monotony and a dead right half | Station photos are **sticky for the length of their chapter**. Text and photo are wrapped so the picture stops before the gate band |
| P1 | No wayfinding on a very long page | A **gate rail**, sticky at the top: Gate 1 to Gate 4 by name, then the cup. Each barrier icon lifts when its gate is lifted, and the marble shows progress along the run. Every stop is a link |
| P2 | Mobile: about 28-character measure, photo after the text | The lane is 2 rem wide, the photo comes first in each station, and the gap is tighter |
| P2 | The bin is tiny and far from the cup | The bin is bigger and sits directly past the cup, so the flight off the end lands next to the landing |
| P2 | The track is a passive sine | A switchback every ~420 px, swinging the full lane plus its gaps, with diverge/converge fans on the diamond chapters |

**Not fixed in A (noted for the build phase):**
- **The hero.** The track starts at the photographed marble, not the setup ticket.
- **Content coherence.** Pending "happens at Gate N" slots sit next to a decision for that gate. These are Backend's written-for-the-story decisions next to real-file slots; the build phase resolves it when the gates are real.
- **`/setup/`** is the shared page (the world is in the components, not in a track).

**Detect** (`npx impeccable detect --json --viewport W` on the rendered URLs, at 390, 768, 1440 and 1920; home and `/setup/`): two rules, both justified.
- **`hard-offset-shadow`:** 53 on home, 8 on `/setup/`. This is Direction C's deliberate toy depth: `4px 5px 0 #1C2147` on outlined, flat-filled objects, removed when pressed. The human approved it at Gate 2, and `DESIGN.md` records it as "The Earned Hard Shadow Rule". Kept.
- **`em-dash-overuse`:** 1 on `/setup/`. A false positive: the rule counts the `--` in CLI flags inside `<code>` (`--check`, `--yes`, `--skip-comfyui`). There are no em-dashes in the copy.
- **Nothing else**, at any width.

**Verified behaviour** (Playwright, with the strict header CSP injected; Chromium, Firefox and WebKit; motion on and reduced): 33 of 33.
- At the top, the photographed marble is the marble.
- Scrolled past G1, the marble waits above the crossing. Lifting G1 releases it.
- "Wear Signal Path" re-skins the page.
- "Without humans" lands the marble in the bin and lists the skipped decisions.
- With reduced motion there's no rolling marble, a marble rests at each station, and the crossings are pre-lifted.
- No errors or CSP violations.

**Imagery.** The evidence uses Concept's production set: the six-figure cast in every shot, a station photograph for each agent's chapter, and the clay cup. It also uses Concept's token fixes: the text-safe tomato-ink accent, with bright tomato kept for shapes. The registry is shared (`web/src/lib/images.ts`). The suites were rerun after the swap and all pass. In A the hero track starts at the photograph's marble (position from Concept's sidecar), and each gate band has its own gate photograph.

## Evidence

- **Screenshots:** `screenshots/g3/*-variant-how-it-works-g3-a-long-run-{home,setup}-{390,768,1440,1920}.png`.
- **Motion:** `screenshots/g3/motion/a-long-run-desktop.webm` (41 s): the roll, the wait at Gate 1 while scrolling on, the lift, all three themes, and the run without humans.
