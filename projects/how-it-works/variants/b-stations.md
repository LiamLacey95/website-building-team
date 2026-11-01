# Variant B: stations

Branch: `variant/how-it-works-g3-b-stations` · Port: 4322 · Worktree: `<worktreesDir>/variant-how-it-works-g3-b-stations`

## Hypothesis

**Framed shots read as more polished and cinematic than a continuous track.** The story is a sequence of stations, shown one at a time.
- **The stage.** Each station opens on a full-viewport stage: the station's clay photograph, the chapter's title and dek on a white ticket, and a short wooden track along the bottom that the marble rolls in on.
- **The detail.** The full chapter (narrative, scenes, artefacts) and its gate follow under the stage.
- **The station bar.** A fixed bar (Previous, "Station 5 of 11", Next) pages between stations through View Transitions that carry the marble across. Its dots show gate stations as red squares, and it responds to arrow keys and `#hash` deep links.
- **The gates.** On a gate station the marble **waits** at the stage's barrier. The ticket's "Lift the barrier" button jumps to the crossing, and Next says "barrier still down" until it is lifted.
- **Without humans.** It flips through every remaining station and ends with the marble in the bin at the cup.

## Persona served

**Tomás** (studio owner): each station is a composed frame he could show a client, and the bar's four red squares are the four decisions he keeps. **Sam** gets one station at a time instead of one very long page.

## Trade-off

- **Find-in-page.** Paging hides the other stations from find-in-page while JS is on.
- **No overview.** You see one frame, not the run as a whole; the bar is the overview.
- **The track is short.** Each stage has its own short track, not one continuous run.
- **Stronger frames, weaker flow.** Art direction per frame is stronger than A's, and the sense of one continuous machine is weaker.
- **No-JS fallback.** Without JS everything stacks as one page.

## Impeccable

**Shape brief** (no live round; the inputs were brief 07's hypothesis, Concept's direction, `PRODUCT.md` and `DESIGN.md`):
- **Job:** the same as A. Mode: Persuade, carried by Read.
- **Direction:** a cinematic stage per station, with the detail below it. The focal moment is the marble waiting at a stage's barrier. The transitions carry the marble between frames.
- **Scope:** home and `/setup/`.
- **Constraints:** the same as A. In addition, paging must keep every station in the DOM, keyboard operable, deep-linkable and readable without JS.

**Commands run:** `context`, `shape`, the build (craft floor; `src/scripts/stations.ts` on the shared engine), `critique` (an independent Assessment A plus `detect`), fixes, `detect`.

**Critique, first build:** health 22/32. The estimated creativity score was **6.55** weighted (D 7, C 7, S 6.5, P 6, U 6), below the G3 bar. What changed:

| # | Issue | Change |
|---|---|---|
| P1 | The barrier and its decision are about 2,000 px apart, and Next skips past a lowered barrier | Gate tickets have **"Lift the barrier"**, which jumps to the crossing. The barrier is 9 rem wide. **Next shows "(barrier still down)"** until the gate is lifted |
| P1 | Gate 2 shows "happens at Gate 2" placeholders | The Gate 3 builds use the contract's `CONTENT_SLOTS=filled` stand-ins (captioned as stand-ins), in all three variations |
| P1 | The station bar collides with content | The stage is sized to the viewport minus the header and the bar, and `scroll-padding-bottom` stops the fixed bar covering focus (WCAG 2.4.11) |
| P2 | The finale is empty | The cup stage has the cast photograph. The track now ends in the cup, and the bin sits past it |
| P2 | Copy said "Nine stations", and tags sat above the h2 | It now says "Eleven stops, four gates". The tags sit after the dek (Ticket Not Kicker Rule) |
| P2 | Mobile drops the gate squares, and the label wraps | The dots stay at 1 rem, the label is short ("Station 5 of 11"), and the barrier note is announced but visually hidden on narrow screens |

**Detect** (rendered URLs, 390 and 1440, home, `#define` and `/setup/`):
- **`hard-offset-shadow`:** justified, Direction C's toy depth (see A).
- **`em-dash-overuse`** on `/setup/`: the false positive from the `--` in CLI flags.
- **`line-length`:** 2 at first; fixed on master (running text is capped at `min(--measure, 34em)`, about 75 characters in Atkinson).
- **Nothing else.**

**Verified behaviour** (strict header CSP; Chromium, Firefox and WebKit; motion on and reduced; plus no-JS): 40 of 40.
- One station at a time, and ArrowRight pages with the hash updated.
- The marble waits before the G1 barrier, and lifting releases it.
- Wearing Paper Trail re-skins the page.
- "Without humans" flips to the cup station and lands in the bin, with the skipped list shown.
- With reduced motion the crossings are pre-lifted.
- Without JS every station stacks and the bar is hidden.
- No errors (overlapping View Transitions are absorbed in the shared `transition()`).

## Evidence

- **Screenshots:** `screenshots/g3/*-variant-how-it-works-g3-b-stations-{home,setup}-{390,768,1440,1920}.png`. Full-page shots show the first station only, because the stations are paged.
- **Motion:** `screenshots/g3/motion/b-stations-desktop.webm`: paging with the marble carried across, the wait and lift at Gate 1, the re-skin, and the run without humans through every station into the bin.
