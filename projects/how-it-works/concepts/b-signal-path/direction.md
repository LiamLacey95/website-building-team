# Direction B: Signal Path

**One line:** the team is a modular hardware instrument in a dark studio; your sentence is the signal, you watch it travel through six modules on an oscilloscope, and at four points it waits for a human to throw a switch.

**Memorability sentence** (what a visitor tells a friend): *"It's built like a synthesiser: your sentence travels as a signal through six modules on an oscilloscope, it won't pass a gate until you flip the switch, and you can pull the Review module's cable to see the bugs that would have shipped."*

**Hero line (proposal):** *"Input: one sentence. Output: this website. Follow the signal."*

## The world

- **The site is a rack of hardware, at night.** It is a vertical modular instrument on matte black, lit only by its own indicator lamps. Everything is panel, knob, jack, cable and screen: precise and engineered, a bit nerdy, never cold, because the light is warm amber.
- **The prompt is a signal**: an amber pulse that enters through an input jack at the top of the page and is routed by a patch cable down the left margin, through every chapter.
- **The team are six modules in the rack**, each a slim faceplate with its own personality and a small spec block (set in HTML, never in the image):

  | Agent | Module | Faceplate character |
  |---|---|---|
  | PM | **Sequencer** | a grid of step buttons; it sends briefs on the beat |
  | Research | **Analyser** | a small round scope screen; it listens before anything is made |
  | Concept | **Oscillator** | one huge tuning knob; it makes the raw material, three waveforms |
  | Front-end | **Filter** | a long fader; it shapes and cuts |
  | Backend | **Patch bay** | covered in jacks; it routes and connects |
  | Review | **Gate / limiter** | a guarded switch; nothing passes above the line |

- **Files are I/O.** Briefs are patch cables plugged into a module's input, and reports come out of its output jack. Real artefacts appear on the module's small screen: a markdown excerpt in amber mono, or a screenshot on a CRT-styled frame.
- **The double diamond is the signal's envelope on an oscilloscope.** One sentence widens into many possibilities (diverge), narrows to one decision (converge), twice. It is drawn as a live trace across the top of each chapter and as a mini scope in the progress rail.

**Mood words:** precise, nocturnal, warm-lit, engineered, playful-nerdy, tactile, confident.

**Who it suits:** Maya, the agent-native builder, most of all. It shows the mechanics: who passes what to whom, the "wiring" between threads, the four hard stops. It turns Research's insight 2 ("one sentence and one diagram carry everything") into a literal instrument. Its dark, precise look stands well clear of the warm-paper AI-site trend, and also of the purple-gradient one.

## Signature set piece: "Throw the switch"

A live oscilloscope trace draws the double diamond as you scroll, and at each gate the signal really stops until you throw a guarded switch.

1. **Hero.** Dark panel. The setup sentence sits in a real, editable input field styled as the instrument's input slot, set in amber mono. The visitor can leave it, or type their own website idea; there is no fake blinking cursor, only the field's native caret when focused. The copy button is a small momentary push-button beside it. On the right is the WEB1 key art, the rack with one glowing amber cable. Scrolling plugs the cable in with a short mechanical motion and the input lamp turns on (a solid lit colour, no glow halo).
2. **The scope.** A sticky oscilloscope screen, a `<canvas>` with an SVG fallback, sits at the top of the viewport on wide screens and inline on mobile. As you scroll through Discover, its trace widens from one thin line into a bright, noisy band (many ideas); through Define it narrows back to a point. The trace is plotted from scroll progress, not time, so it never runs away from the reader.
3. **Gate 1.** The trace freezes at the diamond's point and an amber **HOLD** lamp turns on, steady, not pulsing; the lamp is tied to real page state. In the page, a guarded toggle switch appears: a real `<button>` with `aria-pressed`, and a hinged red safety cover that flips open on focus or hover. Throwing it ("Approve") animates the toggle, turns the lamp green and lets the trace continue. The alternative button, "Revise", patches a cable back to an earlier module: the trace loops back visibly, then rejoins. After the first throw, the page shows what the human actually chose.
4. **Concept.** The Oscillator module emits three waveforms side by side, the three directions, each with its key art on a small screen. G2 collapses them into one.
5. **Variations.** The Patch bay shows three parallel signal paths (three git worktrees) with three screenshots on three screens. G3 selects one. Build and Review run through the Gate/limiter module, where Review's findings appear as clipped peaks being flattened. G4 is the final switch.
6. **Output.** The signal arrives at an output jack at the bottom of the page, and the last screen shows this site's own hero: the signal became the page. Repeat the setup sentence in the input slot: "Patch in your own".

### Explaining by playing (the Ciechanowski layer)

Beside the text, each chapter offers one patchable device that teaches a mechanic by letting you break it:

- **Pull a cable.** At the Review chapter, the Gate/limiter module has a patch cable you can pull (button: "Unplug Review"). The signal then skips Review: the scope trace clips, and the output screen lists the real issues Review caught in this project that would otherwise have shipped (contrast failures, a missing alt text, a broken link), each linked to its report. Plug it back in to restore. It is the most concrete possible argument for an independent reviewer.
- **Your sentence, routed.** If you typed your own idea in the hero field, each module's small screen echoes it as that module would receive it. Research's screen shows "Who is this for?", Concept's shows "3 directions for: <your idea>", and so on. It is client-side templating only, with nothing sent anywhere (said in a one-line note). Without input, the screens show this site's real prompt.
- **The patch bay.** One module shows the actual wiring of the team: which threads may message which (PM to all, agent to PM, Front-end to Backend only). Hovering or focusing a jack highlights its cables; it is the communication protocol drawn as a patch diagram.

**Reduced motion:** the scope shows the complete double-diamond trace, static, with gate markers and the current chapter's segment brighter. Switches are rendered in their final position, with the decision text beside them; the lamps are steady, and the cable is drawn complete. The interactive switches still work as plain buttons that reveal the decision, with no animation.

**Accessibility notes:** the scope is decorative (`aria-hidden`), with the same information in text. Switches are labelled ("Gate 1: approve strategy and scope"), keyboard-operable, and never block reading: content after a gate is in the DOM and readable; the switch only animates. Contrast of amber on black is 10.7:1.

## The four gates

Each gate is a **guarded switch with a lamp**:

- the cover is labelled with the gate name in HTML;
- the "spec block" beside it lists what the human saw (packet thumbnails on a small screen) and the options;
- the switch position shows the choice;
- a "patch note" says what changed because of it.

Revise is a cable patched back.

**At Gate 2, in every direction: "wear the other two".** This is adopted from Research's creative benchmark (set piece 3, "You are the human"). The Gate 2 chapter shows the three directions, and choosing one re-skins the next screen in it (palette, type, art) through a View Transition. It then lands back in the chosen world with a note on what the human really picked. The site proves "three directions" by letting you wear them. The three style tiles' tokens are built to be swappable CSS themes for exactly this purpose. With reduced motion, the swap is instant; without JS, the three are shown side by side.

## Type

| Role | Family | Why | Licence |
|---|---|---|---|
| Display and text | **Archivo** (variable: width 62-125, weight 300-900) | A grotesk with a real width axis. Expanded heavy caps for faceplate-style headings, normal width for comfortable reading. One family that behaves like engraved panel lettering and body text | OFL, https://fonts.google.com/specimen/Archivo |
| Labels, readouts, code | **Martian Mono** (variable: width 75-112.5) | A mono with a technical, slightly wide stance, made for UI labels and readouts. Used for module names, jack labels, the input slot and file paths | OFL, https://fonts.google.com/specimen/Martian+Mono |

**Scale** (1.333 ratio, 17 px base): 17 / 22.6 / 30 / 40 / 53 / 71 / 95 px. Display at width 125, weight 800, all caps, tracking +2%. Text at width 100, weight 400, line height 1.6. Labels are Martian Mono 12-13 px, all caps, tracking +8%, in `label` grey or amber.

**Wordmark:** a faceplate. "WEBSITE / BUILDING / TEAM" stacked in Archivo Expanded 800, left-aligned, with a single amber jack circle where a full stop would be. A small mono serial line under it: "6 MODULES · 4 GATES".

## Palette

| Token | Hex | Use |
|---|---|---|
| `panel` | `#0D0E0C` | page (the rack) |
| `panel-2` | `#181A17` | module faceplates, cards |
| `rule` | `#2C2F2A` | hairlines, grid, jack rings (decorative) |
| `silk` | `#ECE8DC` | text (silkscreen white) |
| `label` | `#9A9C93` | secondary text, labels |
| `amber` | `#FFB224` | the signal: cable, scope trace, links, active state |
| `go` | `#6BD38A` | lamp after approval (always paired with a text label, never colour alone) |
| `guard` | `#FF5A47` | switch safety covers, Review's flags |

**Contrast (computed):**

| Text on background | Ratio | Result |
|---|---|---|
| silk on panel | 15.80 | AA |
| label on panel | 6.96 | AA |
| amber on panel | 10.73 | AA |
| guard on panel | 6.27 | AA |
| go on panel | 10.42 | AA |
| silk on panel-2 | 14.30 | AA |
| label on panel-2 | 6.30 | AA |
| amber on panel-2 | 9.71 | AA |
| panel on amber (primary button label) | 10.73 | AA |
| panel on silk (light "spec sheet" insert) | 15.80 | AA |

**Focus ring:** a 2 px amber outline with a 3 px panel gap. On amber buttons, a silk ring.

## Shape language

- **Corners:** machined: 6 px on modules, 3 px on buttons, fully round on knobs, jacks and lamps.
- **Borders:** 1 px `rule` hairlines define modules, with screw-hole dots at module corners. The measurement grid appears only where it measures something: inside the oscilloscope screen and on the patch-bay diagram. There is no decorative grid on the page background.
- **Shadow and light:** no shadows on content and **no glow anywhere**. A lit lamp is a solid colour disc with a small white specular highlight, a material, not a halo. The amber cable in the photography carries the "warm light" feeling, so the UI doesn't have to.
- **Labels:** mono labels sit beside or below the part they name, as on a real faceplate, never as a kicker stacked above a heading. Section headings stand alone.
- **Density:** tight and information-rich, like a spec sheet: small mono labels around large calm display type. Modules sit on the grid.
- **Texture:** WEB5 dark brushed metal at 5% on faceplates.
- **Motion vocabulary:** plug in, light up, trace, hold, throw, route. Mechanical easing (fast in, firm stop), never springy.

## Imagery

Generated with WEB1 (Klein full) plus WEB4 style frames and a WEB5 texture. Picks, prompts and sidecars are in `images/`. The house style sentence:

> Moody product photograph in a dark studio, matte black anodized aluminium and dark graphite surfaces, soft warm amber light glowing from small indicator lamps, faint cool rim light, precise minimal industrial design, shallow depth of field, 90 mm lens, deep velvety shadows, premium hardware catalogue look. Completely blank unlabelled panels…

## Self-check against Review's creativity rubric (as potential, before Review scores it)

- **D (design), about 8-9:** the most cinematic art direction of the three: product photography, a dark panel and one warm signal colour. It is the closest to Igloo-level art direction.
- **C (creativity), about 8:** the instrument metaphor carried through every part: input, modules, scope, switches, patch bay, output.
- **S (storytelling), about 8:** "pull a cable" and "your sentence, routed" make the mechanics tangible.
- **P (polish):** demanding, because a dark UI shows every misaligned pixel.
- **U (usability), the main risk:** a canvas scope and interactive gates. Mitigation: native scroll, everything in text, decorative canvas, and switches that never block reading.

**Tells avoided:**

| Tell | How it is avoided |
|---|---|
| `blinking-cursor` | a real input field |
| `dark-glow`, `radial-halo` | no glow; lamps are solid |
| `pulsing-dot` | lamps are steady and stateful |
| `codex-grid-background` | grid only in measurement surfaces |
| `kicker-above-heading` | labels sit beside parts |
| `ai-color-palette` | amber on black, no cyan or purple |
| `overused-font` | Archivo and Martian Mono, not Geist |

## Risks

- **Build complexity: high.** A scroll-synced canvas oscilloscope with an SVG fallback, sticky layout, interactive guarded switches with state, cable routing that survives responsive layouts, and an image-heavy dark theme. It is the most engineering of the three, and also the most "showcase".
- **Hardware lookalikes:** modular synthesiser fans will think of Eurorack and Teenage Engineering. Keep the faceplates our own: no orange-and-grey, no real brand shapes, and check the images for logo-like marks.
- **Fake text on faceplates:** Klein likes to add numbers around knobs. Every pick is checked; the README notes that labels are always HTML.
- **Dark theme and long reading:** body text must stay at 17 px or more with 1.6 line height. The "spec sheet" light inserts break up long passages.
- **The metaphor needs a legend once:** the hero subline says "six modules, four switches you throw" so newcomers aren't lost.
- **Licence note:** the images are FLUX 3 Klein (FLUX Kommunity licence, allowed under the Gate 1 answer: revenue under US$5M), and any upscales are RealESRGAN (BSD-3). All fonts are OFL. The double-diamond envelope credits the Design Council (CC BY 4.0, adapted).
