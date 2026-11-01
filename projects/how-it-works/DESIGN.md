---
name: Website Building Team (how-it-works)
description: A handmade clay-and-wood marble run on a sunflower wall; your sentence is the marble, and a real hand lifts every barrier.
colors:
  sunflower-wall: "#FFC53D"
  sky-table: "#BFE3F2"
  ticket-white: "#FFFFFF"
  deep-navy: "#1C2147"
  navy-muted: "#3A3F63"
  tomato: "#E8492C"
  tomato-ink: "#B7321A"
  mint-track: "#4DBF95"
  birch-wood: "#D8A46A"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(2.75rem, 4vw + 1rem, 4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 96, 'wdth' 85"
  headline:
    fontFamily: "Bricolage Grotesque, Arial Rounded MT Bold, sans-serif"
    fontSize: "clamp(2.1875rem, 3vw + 1rem, 3.4375rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 96, 'wdth' 85"
  title:
    fontFamily: "Bricolage Grotesque, Arial Rounded MT Bold, sans-serif"
    fontSize: "1.40625rem"
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: "Atkinson Hyperlegible Next, Verdana, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Bricolage Grotesque, Arial Rounded MT Bold, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 800
    lineHeight: 1.4
    fontVariation: "'opsz' 14, 'wdth' 90"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.9375rem"
    fontWeight: 600
rounded:
  sm: "10px"
  md: "14px"
  lg: "18px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "14px"
  "4": "18px"
  "5": "28px"
  "6": "40px"
  "7": "64px"
  "8": "96px"
components:
  button:
    backgroundColor: "{colors.ticket-white}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "44px"
  button-strong:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.sunflower-wall}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-go:
    backgroundColor: "{colors.mint-track}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-warn:
    backgroundColor: "{colors.tomato-ink}"
    textColor: "{colors.ticket-white}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  card:
    backgroundColor: "{colors.ticket-white}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.lg}"
    padding: "40px"
  ticket:
    backgroundColor: "{colors.ticket-white}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.pill}"
    padding: "14px 14px 14px 28px"
  tag:
    backgroundColor: "{colors.mint-track}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 14px"
---

# Design System: Website Building Team (how-it-works)

Written with `/impeccable document` (scan mode) on 2026-11-01, from the code on `master`:
- `web/src/styles/tokens.css` (Direction C's tokens);
- `web/src/styles/global.css`;
- `web/src/components/`.

Qualitative language comes from `concepts/c-marble-run/direction.md`, which the human chose at Gate 2. No separate interview was run. Values live in `tokens.css`, which owns them; this file describes them.

## Overview

**Creative North Star: "The Tabletop Marble Run"**

**The world.** The site is a handmade diorama: a tall marble run of painted birch and plasticine against a sunflower-yellow wall, photographed like stop-motion. The visitor's sentence is a glass marble rolling down the page, and six clay figures work the stations. The track splits and funnels twice, which is the double diamond. At four level crossings, a real human hand decides.

**The point.** Bright, soft, funny and obviously handmade is deliberate: it is the opposite of slick AI aesthetics. Grown-up typography, precise layout and crisp real artefacts keep it from being childish.

**Density.** Airy: one station per screen, big type, lots of yellow wall. All long reading sits on white tickets and cards. Wayfinding is the marble's position on the run, never numbered sections.

**Key Characteristics:**
- Sunflower wall, white reading surfaces, deep navy ink and outlines.
- Cartoon outlines (2.5 px navy) with flat fills, and a hard offset "toy" shadow that disappears when pressed.
- Pill buttons and tickets, 18 px card corners, a CSS glass marble.
- Gravity, not springs: drops accelerate, rolls decelerate.
- Three themes share one 75-token schema (`marble-run` is the default; `paper-trail` and `signal-path` are kept for the Gate 2 re-skin).

## Colors

A painted toy palette: one loud wall colour, one ink, and toy accents that only ever appear on shapes or with a word.

### Primary
- **Sunflower Wall** (#FFC53D): the page background, the painted wall of the diorama. Navy text on it is 9.80:1.
- **Deep Navy** (#1C2147): all text, outlines, focus rings, the strong button and the footer band. 15.47:1 on white.

### Secondary
- **Tomato** (#E8492C, `--c-accent-bright`): barriers, cups, big shapes and large display accents only. It is 3.99:1 with navy, so never use it behind or as small text.
- **Tomato Ink** (#B7321A, `--c-accent` and `--c-accent-ink`): tomato for small text and for the warning button fill. 6.03:1 on white, and white text on it is 6.03:1.
- **Agent colours** (`--agent-*`, with a matching `-ink` for text on each): one per role, matching the clay cast (navy PM, mint Research, sunflower Concept, orange Front-end, white Backend, crimson Review). Always shown with the role's name, never colour alone.

### Tertiary
- **Mint Track** (#4DBF95): the track, "go" states and station tags, always with a word. Navy on it is 6.78:1.
- **Birch Wood** (#D8A46A): track wood and supports (decorative).

### Neutral
- **Ticket White** (#FFFFFF): cards, tickets and every long reading surface.
- **Sky Table** (#BFE3F2): secondary surfaces such as the bin, the studio table, pending slots and the level-crossing scene. Navy on it is 11.40:1.
- **Navy Muted** (#3A3F63): secondary text on white only (10.14:1).

### Named Rules
**The No Grey On Yellow Rule.** Text on the sunflower wall is always full navy (`--c-on-bg-muted` equals `--c-on-bg`). Hierarchy on the wall comes from size and weight, never from a lighter colour.

**The Tomato Is A Shape Rule.** Tomato fills barriers and big shapes; small tomato text uses Tomato Ink, on white only.

## Typography

- **Display font:** Bricolage Grotesque (variable: optical size 12 to 96, width 75 to 100, weight 300 to 800), falling back to Arial Rounded MT Bold.
- **Body font:** Atkinson Hyperlegible Next (variable, weight 300 to 800, with italics), falling back to Verdana.
- **Code font:** the system mono stack, used sparingly for paths and commands.
- **Character:** a characterful, slightly ink-trapped grotesk set heavy and condensed, over the Braille Institute's legibility face. Playful never means harder to read.
- **Hosting:** all faces are self-hosted OFL fonts (`web/public/fonts/`, with their licence file).

### Hierarchy

The scale is a 1.25 ratio on an 18 px base, in rem: 0.8125, 0.9375, 1.125, 1.40625, 1.75, 2.1875, 2.75, 3.4375 and 4rem.

- **Display** (800, `clamp(2.75rem, 4vw + 1rem, 4rem)`, line height 0.98): the hero line only. Optical size 96, width 85, tracking -0.01em.
- **Headline** (800, `clamp(2.1875rem, 3vw + 1rem, 3.4375rem)`, 0.98): chapter and page titles.
- **Title** (800, `clamp(1.40625rem, 1.5vw + 1rem, 2.1875rem)`, 1.05): gate names and card titles. h4 is 1.40625rem at 1.15.
- **Body** (400, 1.125rem, line height 1.6, measure 60ch, about 72 to 78 characters): all reading, with `text-wrap: pretty` on every running text.
- **Label** (800, 0.9375rem, Bricolage optical size 14, width 90): buttons, tags and station tickets.

### Named Rules
**The Ticket Not Kicker Rule.** Station names and gate numbers are tickets beside a heading or figure, never an eyebrow above it. There are no "01 / 02" section numbers.

## Layout

- **Container:** content sits in a 1240 px column with a fluid gutter, `clamp(18px, 4vw, 56px)`. Home pages lay out full-bleed sets; content pages use `.page`.
- **Hero and stations:** a two-column grid (text 5 to 7 fr against imagery 7 to 5 fr) that collapses to one column below 60rem.
- **Rhythm:** a 4 px base with airy steps: 4, 8, 14, 18, 28, 40, 64 and 96 px. Generous separation between stations (64 to 96 px), tight groups inside cards (14 to 18 px).
- **Breakpoints:** content-driven, at 40rem (narrow tickets become rounded cards, tables stack) and 52 to 60rem (grids collapse).

## Elevation & Depth

Depth is a toy's depth, not a screen's. Surfaces are flat fills with a navy outline, lifted by a hard offset shadow with no blur and no glow. Pressing a control removes the offset, so it physically goes down.

### Shadow Vocabulary
- **Rest** (`box-shadow: 4px 5px 0 #1C2147`): cards, tickets, buttons and framed photographs.
- **Lift** (`box-shadow: 6px 8px 0 #1C2147`): button hover, raised by 1 to 2 px.
- **Press** (`box-shadow: 0 0 0 #1C2147`, with `transform: translate(4px, 5px)`): active and `aria-pressed` buttons.

### Named Rules
**The Earned Hard Shadow Rule.** The zero-blur offset shadow is this world's deliberate toy depth (Direction C, approved at Gate 2). It appears only on outlined, flat-filled objects; it is never added to a surface without the 2.5 px outline.

## Shapes

- **Corners:** soft and round. 18 px on cards and photos, 14 px on inner panels and scenes, 999 px pills for buttons, tickets and tags. The marble is a circle.
- **Outlines:** 2.5 px solid navy on every card, ticket, button and photograph, like the outline around a cartoon clay figure.
- **Pending slots** use the same outline, dashed.
- **The one sharp exception** is the barrier: its tomato-and-white stripes are the only hard-edged pattern.

## Components

### Buttons
Tactile pill toys that go down when pressed.
- **Shape:** pill (999px), 2.5 px navy outline, minimum height 44px.
- **Default:** white with navy text. **Strong:** navy with sunflower text (the main action on the wall). **Go:** mint (lifting a barrier). **Warn:** Tomato Ink with white text ("Run it without humans").
- **Hover:** lift (6px 8px offset, translate -1px -2px). **Active or pressed:** offset removed, translate 4px 5px. **Focus:** 3 px navy outline with a 3 px white ring.

### Tickets
The setup sentence is the marble's label: a white pill with the CSS marble, the sentence in mono and a strong Copy button. Below 40rem it becomes a rounded card with the button at full width.

### Cards / Containers
- **Corner style:** 18 px. **Background:** Ticket White. **Border:** 2.5 px navy. **Shadow:** Rest. **Padding:** 40 px (28 px on narrow screens).

### Tags
Mint (or white, for gates) pills in label type, sitting beside a heading. Never above it.

### Navigation
- **Style:** bold body type in navy on the wall.
- **States:** hover and current page get a 3 px tomato underline, offset by 6 px.
- **Mobile:** the links wrap under the wordmark.
- **Wordmark:** "Website Building Team" in Bricolage 800 with the glass marble rolling in after "Team".

### Level Crossing (signature)
A gate as a level crossing.
- **Scene:** a sky scene with a birch rail, a white post and a striped boom across the track, with the glass marble waiting.
- **Controls:** "Lift the barrier" (go) and "Send it back" are disclosure buttons. Lifting swings the boom up and rolls the marble on; sending it back rides the marble back up the lift. Each reveals the decision or the loop-back in text.
- **No JS:** both outcomes are shown. **Reduced motion:** it starts lifted.

### The Marble
A CSS sphere: a radial gradient from white to deep blue with a navy outline. It is never an image, so it moves and scales anywhere (`web/src/scripts/run.ts`).

### Wear The Other Two (Gate 2)
Three swatches, each its own theme scope. Pressing one re-skins the page through a View Transition; motion off makes the swap instant.

## Do's and Don'ts

### Do:
- **Do** put every paragraph on a white ticket or card; text on the wall is short and full navy.
- **Do** give every surface the 2.5 px navy outline before it gets the Rest shadow.
- **Do** use gravity easing: `cubic-bezier(.55, 0, 1, .45)` for drops and `cubic-bezier(.25, 1, .5, 1)` for rolls, with durations of 100, 450 and 1100 ms.
- **Do** design the reduced-motion version: the track drawn complete, the marble resting at each station, barriers drawn lifted with the decision beside them.
- **Do** keep the cast to the six figures on the character sheet (`concepts/c-marble-run/images/c-cast.webp`).

### Don't:
- **Don't** use tomato for small text or on the wall; use Tomato Ink on white.
- **Don't** use elastic or bounce easing, or blur and glow shadows.
- **Don't** stack a kicker or number above a heading.
- **Don't** ship Concept's style frames (`c-frame-*.webp`): their lettering is invented by the model.
- **Don't** hard-code a colour, size or radius in a component; read the token, so the re-skin themes keep working.
