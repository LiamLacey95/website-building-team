# Report 07-frontend-g3-variations (Front-end)

State: DONE. Date: 2026-11-01. Master and the three variant branches are committed with pathspecs. Nothing is pushed.

**Contact sheet:** `projects/how-it-works/screenshots/g3/contact-sheet.html` (home and `/setup/` at 1440 and 390, the three side by side). `screenshots/g3/README.md` lists every file.

## 1. The design system on master

- **Tokens:** Concept's Marble Run tokens are the default on `:root`. Paper Trail and Signal Path are alternate themes on the same 75-token schema, scoped by `data-theme`, and their fonts load only when used. The colour blocks now include Concept's G2 token fixes:
  - `--c-accent` is the text-safe tomato-ink;
  - bright tomato is `--c-accent-bright`, for shapes only;
  - the `--agent-*` colours are added in all three themes.
- **Fonts and textures:** self-hosted WOFF2, with licences.
- **Base components:**
  - `SetupSentence`, `MotionToggle` and `LevelCrossing` (Lift / Send it back; sized by a container query);
  - `WearTheOthers`, `ChapterText`, `Scene`, `Artefact`, `Slot` and `Art`;
  - `.card`, `.ticket`, `.btn`, `.tag` and `.marble`.
- **`DESIGN.md`** (from `/impeccable document`, scan mode) and its sidecar `.impeccable/design.json`. The north star is "The Tabletop Marble Run", with named rules, including the Earned Hard Shadow Rule.
- **Content:** wired to Backend's contract 0.3.2. The Gate 3 builds use `CONTENT_SLOTS=filled` stand-ins, captioned as stand-ins.
- **Imagery:** Concept's production set (commit `62ba09d`). All images go through one registry, `web/src/lib/images.ts`:
  - the six-figure cast;
  - a station per agent;
  - four gate angles;
  - the cup.

  The Gate 2 frames with off-cast figures (`c-hand`, `c-diverge`, `c-studio`) are no longer used. No style frame ships.
- **The marble engine** (`web/src/scripts/run.ts`, shared by all three variations):
  - it waits at every barrier that isn't lifted;
  - it flies to the bin "without humans";
  - with motion off it places the marble without animation;
  - it follows layout changes (`setStops` keeps a run's state across them).

  It was proven first, as Review's G2 notes asked: 30 of 30 checks in Chromium, Firefox and WebKit.
- **Strict CSP:** the header CSP (`script-src 'self'; style-src 'self'`) holds everywhere. There is no inline script, no `<style>` and no `style=`; runtime values go through the CSSOM.

## 2. The three variations

Each one went through `context` → `shape` → build → `critique` (an independent Assessment A plus `detect`) → fixes → `detect`. The full records are in `variants/a-long-run.md`, `b-stations.md` and `c-table.md`.

| Variant | Hypothesis | First critique (weighted; D C S P U) | Main fixes | Checks (3 engines × motion on/reduced; strict CSP) |
|---|---|---|---|---|
| **A · long run** (`:4321`) | One unbroken track down the whole story makes the process physical | 6.45 (6 7 7 6 6) | Full-width gate bands the real track runs through (a gate photo for each); a sticky gate rail; sticky station art; mobile measure; the bin by the cup; switchbacks and fans | 33 / 33 |
| **B · stations** (`:4322`) | Framed shots read as more polished and cinematic | 6.55 (7 7 6.5 6 6) | "Lift the barrier" on gate tickets; Next says "barrier still down"; stage sized to the viewport plus `scroll-padding-bottom`; a finale with the cast photo, cup and bin; "Eleven stops"; mobile dots | 40 / 40 |
| **C · table** (`:4323`) | Play first beats scroll first for memorability | 6.05 (6 7 6 5 6) | Sky tabletop with a birch rim; a visible cue at the waiting barrier; gate labels above the arms; a one-row intro; straight-edged diamonds; mobile rails; no nested cards | 58 / 58 (this suite also checks A's and B's skipped lists) |

**Honest status against the G3 bar** (≥ 7.0 weighted, no axis below 6):
- All three first builds were estimated **below** the bar.
- The fixes address every P1 and most P2s from each critique, and the production imagery has since replaced the off-cast Gate 2 frames.
- **I have not re-scored them.** Review's G3 scoring is the real measure.
- Memorability passed for all three. The critics called C's no-humans run the strongest single beat, and C the highest ceiling.

**Detector** (rendered URLs at 390 to 1920; home, a station and `/setup/`), the same for all three:
- **`hard-offset-shadow`:** justified (Direction C's approved toy depth, DESIGN.md's Earned Hard Shadow Rule).
- **`em-dash-overuse` on `/setup/`:** a false positive (the `--` in CLI flags inside `<code>`).
- **Fixed:** `line-length` and `nested-cards`.
- **Nothing else.**

**No-JS:** A and B read as one page. C shows the table plus every station panel stacked below it, with hotspots as links.

## 3. Evidence

- **Screenshots:** `screenshots/g3/*-variant-how-it-works-g3-<v>-{home,setup}-{390,768,1440,1920}.png` (24 files), plus `manifest.json`. They were re-shot after the imagery and token swap.
- **Motion:** `screenshots/g3/motion/{a-long-run,b-stations,c-table}-desktop.webm` (1440 × 900, VP9; 4.6, 1.7 and 2.3 MB). Each shows its variant's wait-and-lift, the re-skin and the run without humans.
- **Previews:** running locally on 4321, 4322 and 4323. **Vercel preview builds were not attempted.**

## 4. Shared fixes made on master along the way

These came out of building the variants; every variant has them through merges.
- **`[hidden]` always wins** over component `display`. The skipped list showed before the run.
- **Button text inside cards:** `.card a:not(.btn)`. A strong button's text was navy on navy.
- **Text measure:** running text is capped at `min(--measure, 34em)`.
- **`transition()`** absorbs skipped or aborted View Transitions and returns a Promise, so focus can move after the DOM update.
- **`LevelCrossing`:** a container query, and `scene={false}`.
- **`tools/screenshot.mjs`:** waits only for rendered images, with an 8 s cap. Paged layouts used to hang it.
- **Run engine `setStops()`:** A's flown marble was reset when the skipped list opened and changed the layout.

## 5. Open

- **Concept, next round (optional):** AVIF and more widths, cut-out portraits, and the diverge and studio reshoots. Nothing blocks Gate 3.
- **Test note:** with reduced motion, Chromium takes up to about 400 ms to repaint the body after a theme switch. The A suite now polls for it instead of using a fixed wait. In Firefox the free run can take more than 5 s; the suite waits for `mode=flown`.
- **Worktrees** stay until the human picks at Gate 3. The hypothesis files live on master.
