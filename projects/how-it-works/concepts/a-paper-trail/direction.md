# Direction A: Paper Trail

**One line:** the whole process told as one sheet of paper crossing a long studio desk, getting typed, clipped, traced over, stamped and finally bound into the book you are reading.

**Memorability sentence** (what a visitor tells a friend): *"You stamp the four human decisions yourself with a rubber stamp, and when you reach the bottom every page you scrolled past gets bound into a book."*

**Hero line (proposal):** *"One sentence went in. A website came out. This is the paper trail."*
The PM's working line also fits; this one is shorter and names the metaphor.

## The world

- **The site is a desk seen from above**: a deep forest-green leather desk blotter that runs the whole length of the page. Everything on it is paper, photographed flat. The green blotter is the page; cream exists only as sheets lying on it, so the page never falls into the "safe cream background" look.
- **The prompt is a sheet of paper.** It starts as a single index card with the human's sentence typed on it. It never disappears: it gets clipped to a brief, traced over in pencil, copied, stamped and finally bound.
- **The team are six tools on the desk**, not people or robots:

  | Agent | Tool | Why |
  |---|---|---|
  | PM | wooden rubber stamp | decides what moves on; the human borrows it at each gate |
  | Research | brass loupe | looks closely, cites sources |
  | Concept | sable brush | makes the pictures |
  | Front-end | brass straightedge and craft knife | measures, cuts, builds to the grid |
  | Backend | brass bulldog clip | holds things together, keeps the papers in order |
  | Review | vermilion pencil | marks what must change |

- **Files are paper**: briefs are typed sheets with a clip, reports are carbon copies (faded carbon blue), gate packets are manila folders, and git commits are a strip of typed ticker tape. Real artefacts from the repo appear as tipped-in plates: actual screenshots and markdown excerpts, set flat on the blotter.
- **The double diamond is drawn in pencil on tracing paper**, laid over the desk. It is the hero diagram, the progress rail (a narrow strip of tracing paper at the page edge) and the chapter nav.

**Mood words:** tactile, quiet, exact, warm, literate, handmade, trustworthy.

**Who it suits:** Tomás, the studio owner, most of all. It looks like the process document a good studio would hand a client: calm, accountable, every decision on paper. It answers Research's insight 1 ("trust is the bottleneck; real artefacts are the answer") most directly, because the metaphor *is* artefacts. Maya gets the receipts. Sam gets a calm, readable page.

## Signature set piece: "The stamp and the binding"

The double diamond is drawn live in pencil while the prompt-sheet travels; the human's four decisions are rubber stamps you press yourself; and the finale binds everything into a book.

1. **Hero.** A blank cream sheet lies on the left of the blotter, with the WEB1 key art of the tools on the right. The setup sentence is already typed on an index card (no typing animation, no fake cursor), and the copy button is a paper tab on the card's edge.
2. **Scroll into Discover.** A long sheet of tracing paper slides in over the blotter, and a pencil line draws the first diamond's left edge, keyed to scroll position (CSS `animation-timeline: view()` on an SVG `stroke-dashoffset`). Research's loupe moves over clippings; tipped-in plates (persona cards, the reference board) settle onto the desk from the edge, as paper does.
3. **Define converges** the pencil line to the first diamond's point. There the line stops and a manila folder (the G1 packet) slides in, with the stamp resting above it.
4. **Gate 1 stamp.** The rubber stamp is a real button labelled "Approve".
   - **Pressing it** (or Enter) thumps the stamp down: a 120 ms drop with ease-out, a vermilion ring impression appears in SVG with the decision text set in HTML inside it, and the paper shifts 1 px.
   - **"Revise"**, a smaller stamp, draws a dashed pencil loop-back arc to the start of the diamond and slides a typed revision note into the folder, so people see that revising is a normal part of the process.
   - **Either way, the folder then opens** to what the human actually chose.
5. **Concept, Variations, Build** repeat the pattern with their own paper: three proof prints fanned under the loupe (G2), three folded mock-ups (G3), and a stack of pages with Review's red-pencil marks (build and QA).
6. **Gate 4 and the binding.** All the sheets you scrolled past square up into a stack, a cream cloth cover folds over them, and a vermilion ribbon drops in. The last frame is the bound book, and its cover is this site's own hero. Under it is a blank index card with the setup sentence: "Start your own paper trail."

### Explaining by playing (the Ciechanowski layer)

Each chapter has one small hands-on device beside the text, so the mechanics are learned, not just told:

- **Lift the tracing paper.** In every phase, the brief an agent received lies under a sheet of tracing paper showing what it delivered. Press "Lift" (or use the slider) to compare what was asked with what came back, line by line. This is the clearest possible explanation of "briefs in, reports out".
- **Follow a carbon copy.** Each report has a faded-blue carbon behind it. Lift it to see who received a copy, which makes the communication protocol visible: PM to agent, agent to PM, only Front-end and Backend talking directly.
- **Count the pages.** The ticker tape of commits at the receipt chapter can be pulled out to its full length. Each line is a real role-prefixed commit, and its colour shows whose it is.

### Reduced motion and no JS

- **Reduced motion** (OS setting, or the header toggle): the tracing-paper diamond is fully drawn, with the current chapter's segment inked in graphite and the gate marks in vermilion. Every stamp is already pressed; the impressions are static SVG. Plates are laid out in a reading column, and the book is shown closed at the end as a still photograph. The lift and carbon devices still work as instant toggles with no animation.
- **Without JS:** stamps are anchor links to each decision. The tracing-paper comparisons are `<details>` elements. Scroll drawing is CSS under `@supports (animation-timeline: view())`, with the static version as the default.

## The four gates

Each gate is a **manila folder with a stamp**, sharing one "gate card" component:

- on the folder tab: the gate name;
- inside: thumbnails of what the human saw;
- on the open flap: the options as typed lines (A / B / C / revise);
- the stamp impression: what the human chose;
- a clipped note: what changed because of it.

The loop-back is always drawn as a dashed pencil arc.

**At Gate 2, in every direction: "wear the other two".** This is adopted from Research's creative benchmark (set piece 3, "You are the human"). The Gate 2 chapter shows the three directions, and choosing one re-skins the next screen in it (palette, type, art) through a View Transition. It then lands back in the chosen world with a note on what the human really picked. The site proves "three directions" by letting you wear them. The three style tiles' tokens are built to be swappable CSS themes for exactly this purpose. With reduced motion, the swap is instant; without JS, the three are shown side by side.

## Type

| Role | Family | Why | Licence |
|---|---|---|---|
| Display | **Young Serif** | A chunky, old-style book face with ink-trap warmth. It has the presence of a letterpress title page and is not one of the overused AI display serifs. Always set roman, never italic | OFL, https://fonts.google.com/specimen/Young+Serif |
| Text | **Newsreader** (variable, optical size 6-72) | A book face designed for long reading on screens. Roman for text; italic only inside running text | OFL, https://fonts.google.com/specimen/Newsreader |
| Typed and mono | **Courier Prime** | The typewriter voice for the prompt, file paths, commands, folder tabs and stamp text; built for screen legibility, unlike system Courier | OFL, https://fonts.google.com/specimen/Courier+Prime |

**Scale** (1.25 ratio, 18 px base): 18 / 22.5 / 28 / 35 / 44 / 55 / 69 px.
- The hero headline is a full sentence, so it is set at 55 px, not at the top of the scale.
- Chapter titles are 44 px.
- Measure is 62-68 characters; text line height is 1.55.
- Tracking is optical only: −0.5% at display sizes, never tighter.

**Wordmark:** "Website Building Team" in Young Serif with a small typed "No. 1" in Courier Prime after it, like a catalogue number. The seal version is a vermilion stamp ring with "WBT" set in HTML inside.

**No section numbers on headings.** Chapters are shown by where the sheet is on the tracing-paper diamond, not by "01 / 02" labels. Labels are never stacked above headings: a typed tab sits on the edge of a sheet, beside the heading.

## Palette

| Token | Hex | Use |
|---|---|---|
| `blotter` | `#24412F` | page background (the desk) |
| `blotter-2` | `#2F5240` | blotter seams, the progress strip |
| `sheet` | `#F7F2E7` | paper surfaces lying on the desk (cards, folders' insides, plates' mats) |
| `ink` | `#1F1C17` | text on paper |
| `graphite` | `#5B564C` | secondary text on paper, pencil lines |
| `carbon` | `#2C4A75` | links on paper, carbon copies, file paths |
| `vermilion` | `#B8321B` | stamps, gate marks, focus on paper; **only on paper** |
| `brass` | `#E0B04A` | accent and focus on the blotter (loupe, clip, links on green) |
| `pale` | `#CFDCCB` | secondary text directly on the blotter |
| `tracing` | `#F3D77A` | highlight behind text on paper only |

**Contrast (WCAG 2.2, computed):**

| Text on background | Ratio | Result |
|---|---|---|
| sheet on blotter (text directly on the desk) | 10.05 | AA |
| pale on blotter | 7.88 | AA |
| brass on blotter (links, focus) | 5.60 | AA |
| sheet on blotter-2 | 7.83 | AA |
| ink on sheet | 15.21 | AA |
| graphite on sheet | 6.53 | AA |
| carbon on sheet | 8.03 | AA |
| vermilion on sheet | 5.36 | AA |
| sheet on vermilion (stamp button label) | 5.36 | AA |
| blotter on brass (button on green) | 5.60 | AA |
| ink on tracing (highlight) | 11.98 | AA |
| vermilion on blotter | 1.87 | **fail: never used** |

**Focus ring:** on paper, a 3 px vermilion outline with a 2 px sheet offset; on the blotter, a 3 px brass outline.

## Shape language

- **Corners:** square. Paper has 0-2 px radius; only the stamp handle and the copy tab are round.
- **Edges:** paper has no outline borders. It is defined by its colour against the green and by one soft contact shadow (`0 1px 0 rgb(0 0 0 / .18), 0 10px 22px -12px rgb(0 0 0 / .5)`). Hairlines appear only as ruled lines inside paper (index cards, ledger tables). That means one choice, elevation, not border plus shadow.
- **Density:** generous, like a book. Wide margins, one idea per spread. On desktop, plates may break the column, overlap 12-24 px and rotate up to ±1.5°, the only "mess" allowed.
- **Texture:**
  - real leather grain on the blotter: WEB5, a seamless tile at 10% so it never fights text;
  - cotton-paper grain on sheets;
  - tracing paper as a translucent layer at 0.82 opacity.
- **Motion vocabulary:** slide (paper), draw (pencil), thump (stamp), fan (prints), lift (tracing, carbons), bind (book). Paper always arrives from an edge; nothing fades in from nothing. Easing is ease-out-quart; there is no bounce.

## Imagery

Picks, prompts and sidecars are in `images/` (`images/README.md` lists each with its workflow and seed). Key art is WEB1 (Klein full). There are two WEB4 style frames (labelled as mood images, with fake placeholder lettering), a WEB5 texture, and supporting plates for Discover, Concept and the gates. The house style sentence used in every prompt:

> Overhead flat-lay photograph, shot from directly above, on a deep forest-green leather desk blotter, soft north-window daylight from the upper left, gentle long shadows, cream paper, graphite grey, brass and a single vermilion red accent, 50 mm lens, crisp focus, subtle film grain, calm orderly composition with generous empty space. No text…

## Self-check against Review's creativity rubric (as potential, before Review scores it)

- **D (design), about 8:** a strong single art direction (green blotter, paper, brass, one red), real photography, and a book-like type system.
- **C (creativity), about 7-8:** the page *is* the paper trail, and the binding finale and the stamp are specific to this subject.
- **S (storytelling), about 8:** the strongest narrative shape of the three: one sheet from first line to bound book, with lift-to-compare explaining every handoff.
- **P (polish):** the risk is the volume of paper components.
- **U (usability), low risk:** native scroll and a static default.

**Tells avoided:**

| Tell | How it is avoided |
|---|---|
| `cream-palette` | the page is green |
| `italic-serif-display`, `overused-font` | Young Serif, roman |
| `kicker-above-heading`, `numbered-section-labels` | tabs sit beside headings, and there are no numbers |
| `gpt-thin-border-wide-shadow` | shadow only, no borders |
| `blinking-cursor` | the card is pre-typed |
| `oversized-h1` | the full-sentence hero is at 55 px |

## Risks

- **Build complexity: medium.** SVG pencil drawing with scroll timelines, the stamp interaction, the lift-to-compare component, the binding finale (a CSS 3D fold of a cover, with a still-image fallback), and a large family of paper components. No canvas or WebGL. The most work is art-directing many real artefacts as paper plates so they look intentional rather than pasted.
- **It could read as a "nice editorial site"** rather than a showcase. The stamp, the lift and the binding have to be genuinely delightful, or the direction is merely tasteful.
- **Real artefacts as paper:** screenshots look odd at an angle, so keep them flat and rotate only small items.
- **Generated images:** must contain no real lettering. Klein adds fake digits to ruler markings, so the prompts now ask for a plain brass straightedge with no markings. Every pick is checked.
- **Licence note:** the images are FLUX 3 Klein (FLUX Kommunity licence, allowed under the human's Gate 1 answer: revenue under US$5M), and any upscales are RealESRGAN (BSD-3). All fonts are OFL. The pencil double diamond credits the Design Council (CC BY 4.0, adapted).
