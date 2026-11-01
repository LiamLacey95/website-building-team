# Direction C: Marble Run

**One line:** a handmade clay-and-wood marble run built down the whole page: your sentence is a glass marble, six clay figures work the stations, the track splits and funnels twice (the double diamond), and at four level crossings a real human hand decides.

**Memorability sentence** (what a visitor tells a friend): *"A glass marble rolls down the whole page through a clay marble run, a real human hand has to lift each barrier, and if you take the barriers away the marble flies straight off the table."*

**Hero line (proposal):** *"We dropped one sentence in at the top. Watch where it rolls."*

## The world

- **The site is a tabletop diorama**: a tall marble run of painted birch and plasticine against a sunflower-yellow painted wall, photographed like stop-motion. The yellow wall is the page. It is bright, soft, funny and obviously handmade. It is the opposite of slick AI aesthetics, and that is the point.
- **The prompt is a glass marble.** It is dropped in at the top of the page and rolls down the track as you scroll. It never leaves the page.
- **The team is a cast of six clay figurines**, same chunky style, dot eyes, each with one colour and one prop:

  | Agent | Figure | Prop | Station on the track |
  |---|---|---|---|
  | PM | navy | clipboard | the starting funnel, and the switches that route the marble |
  | Research | mint | magnifying glass | a lookout platform, piles of tiny cards |
  | Concept | sunflower | paintbrush | the paint station: the marble comes out with three colour tints |
  | Front-end | tomato | tiny hammer | the workshop where three tracks get built side by side |
  | Backend | white and navy | wrench | the pipework under the track, plumbing and supports |
  | Review | red | small flag | the inspection ramp; it can wave the marble back |

- **The humans are not clay.** At every gate a **real human hand** (photographed, not plasticine) reaches into the diorama and lifts the barrier. That single visual idea says the core promise: the agents do the work, the human decides.
- **The double diamond is the track.** One lane splits into many (diverge) and funnels back into one (converge), twice, with level crossings at the four gates. The hero diagram is the whole run in miniature; the progress rail is a tiny marble on a tiny track.

**Mood words:** playful, handmade, cheerful, kinetic, curious, warm, honest.

**Who it suits:** the widest audience and the best "share this" potential. It is memorable for Sam, who just wants to understand it, and disarming for Tomás, who is sceptical of AI-flavoured polish. Research found that every acclaimed explainer ignored reduced motion and that playful plus accessible is possible (Kirby, `refs/board/c4-kirby-desktop.webp`); this direction proves it. It also uses the ComfyUI pipeline as a showcase: a consistent cast across many generated images is the hardest thing to do, and doing it well is the flex.

## Signature set piece: "The run"

One continuous SVG track runs the full height of the page, and the marble rolls along it, driven by scroll, splitting and merging, and stopping at the gates.

1. **Hero.** On the left: the line and the setup sentence on a little white ticket with a copy button, as if it were the marble's label. On the right: the WEB1 key art, the run with a marble at the top. The marble is a real DOM element sitting exactly over the photo's marble. On first scroll it drops into the page's own SVG track.
2. **Rolling.** The marble follows the track using CSS `offset-path` driven by `animation-timeline: scroll()`, with a small rotation so it reads as rolling. JS adds only a soft bounce at corners. Chapters sit beside the track's switchbacks, and each station's clay figure (a generated image) watches the marble pass.
3. **Diverge.** In Discover the track splits into a fan of thin lanes and the marble becomes several translucent ghost marbles (ideas) that roll down different lanes. In Define they funnel back into one.
4. **Level crossings (the gates).** The barrier is down. The marble rolls up to it and waits, even if you keep scrolling: the page continues, but the marble sits there. A real photographed hand hovers over the lever. The lever is a `<button>`: "Lift the barrier". Pressing it raises the barrier and the marble rolls on. Next to it, "Send it back" shows the loop-back: a little bucket lift carries the marble up to an earlier station, then the story shows what the human really chose.
5. **Concept** tints the marble three colours (three directions), G2 picks one; **Variations** are three parallel tracks built by the tomato figure, G3 picks one; **Review** waves its red flag at a flaw and the marble takes a short detour through a repair loop; G4 lifts the last barrier.
6. **The landing.** The marble drops off the end of the track into a small cup, and the cup is a tiny clay model of this website's own hero. Then "Drop yours in", with the setup sentence again.

### Explaining by playing (the Ciechanowski layer)

Next to the text, the run has three small things to try, each teaching one mechanic by letting you change it:

- **Take the barriers away.** A switch at the first gate, "Run it without humans", lifts every barrier at once. The marble races down unchecked, overshoots the last bend and flies off the edge of the table into a little bin. Beside the bin, an HTML card lists what that run would have skipped: the human's choice of direction, of design, and the release sign-off. "Put the barriers back" resets it. That is the four-gates promise, demonstrated rather than claimed.
- **Drop a second marble.** At the end, "Drop your own sentence" lets you type a website idea onto a new marble's ticket. Each station's figure holds up a little card with what it would do with your idea (client-side templating only, with nothing sent anywhere). It shows the six roles applied to *your* project.
- **Who talks to whom.** At the studio chapter, the six figures stand around a table passing tiny paper notes. Pressing a figure highlights who it may hand notes to (everyone to the PM; Front-end and Backend to each other), which is the communication protocol made physical.

**Reduced motion:** the track is drawn complete. The marble appears resting at each station as a static illustration (one per chapter) instead of rolling. Barriers are drawn lifted, with the decision on a little sign (HTML) next to them. Ghost marbles are shown as a static fan. The lever buttons remain, as plain links to the decision. No bounce, no lift animation.

**Accessibility notes:** the track and marble are decorative (`aria-hidden`), and the story is fully in text. Gate buttons have visible labels; nothing is hover-only. Drag is never required: the marble is scroll-driven, and an optional "push the marble" drag interaction has a button alternative (WCAG 2.5.7).

## The four gates

Each gate is a **level crossing**:

- a striped barrier with a small sign in HTML: "Gate 2: creative direction";
- a ticket booth window shows what the human saw (packet thumbnails);
- the barrier position plus a stamped ticket show the decision;
- a clay figure holds up a little card: what changed.

Revise is the bucket lift back up.

**At Gate 2, in every direction: "wear the other two".** This is adopted from Research's creative benchmark (set piece 3, "You are the human"). The Gate 2 chapter shows the three directions, and choosing one re-skins the next screen in it (palette, type, art) through a View Transition. It then lands back in the chosen world with a note on what the human really picked. The site proves "three directions" by letting you wear them. The three style tiles' tokens are built to be swappable CSS themes for exactly this purpose. With reduced motion, the swap is instant; without JS, the three are shown side by side.

## Type

| Role | Family | Why | Licence |
|---|---|---|---|
| Display | **Bricolage Grotesque** (variable: optical size 12-96, width 75-100, weight 300-800) | A characterful, slightly ink-trapped grotesk that feels handmade at large sizes without being a "fun font" cliché. Bold condensed headlines with personality | OFL, https://fonts.google.com/specimen/Bricolage+Grotesque |
| Text | **Atkinson Hyperlegible Next** (variable, weight 300-800, italics) | Designed by the Braille Institute for maximum legibility: friendly, rounded, and a quiet statement that playful does not mean less accessible | OFL, https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next |
| Code | the system mono stack (`ui-monospace, "SFMono-Regular", Consolas, monospace`), used sparingly for file paths and commands | Keeps the type budget at two families | n/a |

**Scale** (1.25 ratio, 18 px base): 18 / 22.5 / 28 / 35 / 44 / 55 / 69 / 86 px. Display at optical size 96, weight 800, width 85 (slightly condensed); text at 400, line height 1.6.

**Wordmark:** "Website Building Team" in Bricolage Grotesque 800, tight, with the dot of a glass marble (a small radial-shaded circle in CSS) rolling in from the left and resting after "Team". Pressing it rolls the marble again; with reduced motion it simply sits.

## Palette

| Token | Hex | Use |
|---|---|---|
| `sun` | `#FFC53D` | page background (the painted wall) |
| `white` | `#FFFFFF` | cards and tickets: all long-form text sits on white |
| `navy` | `#1C2147` | text, outlines, the PM figure, footer band |
| `tomato` | `#E8492C` | barriers, big shapes, large display text only |
| `tomato-ink` | `#B7321A` | tomato for small text and links, on white only |
| `mint` | `#4DBF95` | track, "go" states (always with text) |
| `sky` | `#BFE3F2` | secondary surface (the bin, the studio table) |
| `wood` | `#D8A46A` | track wood, supports (decorative) |

**Contrast (computed):**

| Text on background | Ratio | Result |
|---|---|---|
| navy on sun (text directly on the wall) | 9.80 | AA |
| navy on white | 15.47 | AA |
| tomato-ink on white (links, small accents) | 6.03 | AA |
| white on tomato-ink (secondary button) | 6.03 | AA |
| navy on mint | 6.78 | AA |
| navy on sky | 11.40 | AA |
| navy on wood | 6.95 | AA |
| sun on navy (footer band, primary button reversed) | 9.80 | AA |
| white on navy | 15.47 | AA |
| tomato-ink on sun | 3.82 | large text only: **not used** for small text |
| navy on tomato | 3.99 | AA large text only (24 px+, or 19 px bold) |

**Focus ring:** a 3 px navy outline with a 3 px white offset. It is visible on the yellow wall, on white and on navy.

## Shape language

- **Corners:** soft and round: 18 px on cards, 999 px pills for buttons and tickets, and the marble is a circle. Nothing sharp except the barrier stripes.
- **Borders:** 2.5 px navy outlines on cards and buttons, like the outline around a clay figure in a cartoon, with flat fills inside.
- **Shadow:** a hard offset drop (`4px 5px 0 #1C2147`) for "toy" depth on buttons and cards. No blur, no glow. Pressing a button removes the offset, which feels like it physically went down.
- **Density:** airy. One station per screen, big type, lots of yellow wall.
- **Texture:** WEB5 painted birch-plywood grain for track pieces and cards' back sides, plus a faint brush-stroke texture at 4% on the yellow wall.
- **Motion vocabulary:** drop, roll, wait, lift, tint, land. Easing follows gravity instead of springs:
  - drops accelerate (ease-in);
  - rolls along a track decelerate (ease-out-quart);
  - landings settle with one small physical rebound computed from height, not a generic bounce or elastic curve.
- **Labels:** station names are tickets beside the figure, never kickers stacked above headings. There are no "01 / 02" section numbers; the marble's position on the run is the wayfinding.

## Imagery

Generated with WEB1 (Klein full), WEB2 for keeping the cast consistent, WEB4 style frames and a WEB5 texture. Picks, prompts and sidecars are in `images/`. The house style sentence:

> Handmade claymation diorama photograph, matte plasticine figures and painted birch-wood parts, rounded soft shapes, set against a smooth sunflower-yellow painted backdrop, cheerful palette of sunflower yellow, tomato red, mint green, white and deep navy, soft diffused studio light, gentle shadows, tilt-shift miniature look, shallow depth of field, 100 mm macro lens. No text…

## Self-check against Review's creativity rubric (as potential, before Review scores it)

- **D (design), about 8:** a bold, unmistakable world: a yellow wall, clay cast, wooden run. You could identify it from a 200 px crop.
- **C (creativity), about 9:** the marble *is* the prompt, the run *is* the double diamond, and the hand *is* the human. It carries through the whole page and would be very hard to reskin for another brand.
- **S (storytelling), about 8:** the counterfactual "without humans" run is the strongest single explanation moment of the three directions.
- **P (polish):** consistency of the cast across images is the hardest polish problem.
- **U (usability), medium risk:** a long SVG path and motion-rich chapters. Mitigation: everything is decorative over real text, with a designed static version.

**Tells avoided:**

| Tell | How it is avoided |
|---|---|
| `cream-palette` | the page is sunflower yellow |
| `bounce-easing` | gravity-based easing, no elastic curves |
| `kicker-above-heading`, `numbered-section-labels` | tickets sit beside, and there are no numbers |
| `shape-assembled-illustration` | the art is generated photography; SVG is only the track |
| `overused-font` | Bricolage and Atkinson |

## Risks

- **Build complexity: medium-high.** The scroll-driven `offset-path` marble along one long SVG path that must reflow at four widths; the marble "waiting" at gates while content scrolls; ghost marbles; and around 10 generated station images that must look like one cast. CSS can do most of the motion; JS is needed for gate state and the bounce.
- **Cast consistency** is the hardest image problem in the whole project: the same six figures across many scenes. Mitigation: a character sheet first, then WEB2 with the sheet as a reference for every station shot.
- **"Childish" risk:** for Tomás, a toy look could undersell professional work. Mitigation: grown-up typography, precise layout, real artefacts presented crisply at each station, and dry copy.
- **Tracking the marble across responsive layouts:** the track must be authored per breakpoint (desktop zig-zag, mobile straight drop with small switchbacks).
- **Licence note:** the images are FLUX 3 Klein (FLUX Kommunity licence, allowed under the Gate 1 answer: revenue under US$5M), and any upscales are RealESRGAN (BSD-3). All fonts are OFL. The track-as-double-diamond credits the Design Council (CC BY 4.0, adapted).
