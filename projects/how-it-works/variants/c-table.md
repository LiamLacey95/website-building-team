# Variant C: table

Branch: `variant/how-it-works-g3-c-table` · Port: 4323 · Worktree: `<worktreesDir>/variant-how-it-works-g3-c-table`

## Hypothesis

**Play first beats scroll first for memorability.** The whole marble run sits on one diorama table that you can see at once, and you explore it rather than read it in order.
- **The table.** A sky-blue tabletop with a birch rim carries one wooden track through all ten chapters. The double-diamond chapters split into two straight-edged lanes and rejoin. The track is drawn twice (landscape and portrait), and the visible drawing drives the marble.
- **Stations and barriers.** Every station is a hotspot with its clay photograph. Each of the four gates is a barrier on the track.
- **Drop the marble.** It rolls until the first lowered barrier and waits there. A visible ticket at the barrier says "Gate 1 is down. Open it to decide."
- **Zoom in.** A hotspot or barrier opens that station's panel through a View Transition that morphs the hotspot's picture into the panel's. "Back to the table" (or Escape) returns focus to the hotspot. Lifting a gate inside its panel lets the marble roll on to the next one.
- **Without humans.** The barriers vanish, the marble flies off the table into the bin, and the four skipped gates are listed below the table.

## Persona served

**Maya** (agent-native builder): the run is a machine she can operate. She can drop the marble, lift a barrier and watch it roll on, or take the humans out and see what gets skipped. **Tomás** sees the size of the process in one frame. **Sam** has "Read it in order" and Next links when the table is too much.

## Trade-off

- **No arc by default.** Random access weakens the story's build to the payoff. "Read it in order" and the panels' Next links restore it, but they are optional.
- **The map hides while you read.** A panel replaces the table, so the reader leaves the map to read a station (Back returns them to the same spot).
- **Small pictures on the board.** Hotspot thumbnails are small at every width. The photography is seen properly only inside the panels.
- **The most JS of the three.** Without JS, the hotspots are links to the panels stacked below the board, so everything is still readable.
- **Highest ceiling, least finished.** Its single beat (the no-humans run seen across the whole table) was judged the strongest of the three, but it scored lowest on the first build.

## Impeccable

**Shape brief** (no live round; the inputs were brief 07's hypothesis, Concept's direction, `PRODUCT.md` and `DESIGN.md`):
- **Job:** the same as A. Mode: Explore, carried by Persuade.
- **Direction:** the table is the page. The focal moment is the marble waiting at a barrier on a run you can see in full. The counter-moment is the marble flying off the table.
- **Scope:** home and `/setup/`.
- **Constraints:** the same as A. In addition, every station must be reachable by keyboard and by `#hash`, focus must return after every zoom, and the page must read in full without JS.

**Commands run:** `context`, `shape`, the build (craft floor; `src/scripts/table.ts` on the shared engine), `critique` (an independent Assessment A plus `detect`), fixes, `detect`.

**Critique, first build:** heuristics 24/36. The estimated creativity score was **6.05** weighted (D 6, C 7, S 6, P 5, U 6), below the G3 bar and with P below 6. Memorability passed: "the whole process is a marble run on a table, and if you hit 'run it without humans' the marble flies off into a bin." What changed:

| # | Issue | Change |
|---|---|---|
| P1 | The board is yellow, not the sky table: the texture painted over the sky fill, so the table merged into the wall | The board is plain sky blue with a **birch rim** (inset shadows inside the border), so it reads as a tabletop standing off the yellow wall |
| P1 | Nothing visible says what to do when the marble waits | A **ticket at the waiting barrier**: "Gate 1 is down. Open it to decide." The status region says the same for screen readers |
| P1 | Gate arms cover their labels | Each gate's label sits above its arm, in a bordered pill |
| P2 | The first viewport at 1440 is a type-only hero, so "play first" opens with reading | A **one-row intro** (title and setup sentence side by side), so the table starts inside the first viewport. The "what happens next" line moved under the board |
| P2 | The double diamond is two soft lens curves | **Straight-edged diamonds** that split and rejoin |
| P2 | At 390 px labels pile up, and thumbnails are 40 px | Narrow board: the stations sit on **fixed rails** left and right at their height on the run, the thumbnails are 48 px, and the track drawing is narrower |
| P2 | The panel's title block was a card holding card-like buttons | The panel titles sit straight on the wall (`nested-cards` cleared) |

Two behaviour fixes came out of testing: focus now moves to the panel heading after the View Transition has finished (the shared `transition()` returns a Promise), and the board only rebuilds the run when the drawing switches orientation (rebuilding inside the `ResizeObserver` looped in WebKit).

**Detect** (rendered URLs, 390 and 1440, home, `#define` and `/setup/`):
- **`hard-offset-shadow`:** justified, Direction C's toy depth (see A).
- **`em-dash-overuse`** on `/setup/`: the false positive from the `--` in CLI flags.
- **`nested-cards`:** fixed (see the table).
- **Nothing else.**

**Verified behaviour** (strict header CSP; Chromium, Firefox and WebKit; motion on and reduced; plus no-JS): every check passes.
- Drop: the marble waits at Gate 1 (with reduced motion, the crossings are pre-lifted and it goes straight to the cup).
- Opening Gate 1 zooms into Define, with focus on its heading.
- Escape returns to the table with focus back on the barrier. After Gate 1 is lifted, the marble rolls on to Gate 2.
- Wearing Signal Path re-skins the page.
- "Without humans" flies into the bin and shows the skipped list.
- No errors or CSP violations.
- Without JS, all nine station panels stack below the board, and the stations are links.

**Imagery.** The evidence uses Concept's production set: the six-figure cast in every shot, a station photograph for each agent's chapter, and the clay cup. It also uses Concept's token fixes: the text-safe tomato-ink accent, with bright tomato kept for shapes. The registry is shared (`web/src/lib/images.ts`). The suites were rerun after the swap and all pass.

## Evidence

- **Screenshots:** `screenshots/g3/*-variant-how-it-works-g3-c-table-{home,setup}-{390,768,1440,1920}.png`. Full-page shots show the table only, because the panels are hidden until opened.
- **Motion:** `screenshots/g3/motion/c-table-desktop.webm`: drop, the wait and cue at Gate 1, the zoom into Define and the lift, back to the table and the roll on to Gate 2, the Concept station and the Paper Trail re-skin, and the run without humans into the bin.
