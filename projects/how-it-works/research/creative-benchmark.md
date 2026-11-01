# Creative benchmark: how-it-works

Date: 2026-11-01. For Concept, following the Gate 1 decision (`gates/G1-strategy/DECISION.md`): **the site is measured on creativity, interest and polish.** Accessibility and reduced motion still apply.

This is links and notes only; no screenshots are committed (Q10). "Signature moment" lines come from each site's page text, code and case studies. Treat them as leads to open in a browser, not as reviews. A reduced-motion note of "not found" means no `prefers-reduced-motion` handling was found in the shipped code; nobody tested the site by hand. Guesses are marked *(inferred)*.

## The quick read

- **Explainers that win awards turn a process into a place or a machine you move through**: Terminal Industries' yard, Stripe's BFCM machine, The Pudding's mazes. Ours is the double diamond, so make it a place.
- **The best ones let the visitor *do* something** at the key moment: a calculator, a maze to solve, a button to play an explorable, a Bézier editor. Our key moments are the four gates, so the visitor should get to play the human.
- **Polish comes from rhythm:** Dropbox's "peaks and pauses", sticky chapter indexes, a progress ruler. Ours maps naturally to six agent peaks and four gate pauses.
- **Reduced motion is weak almost everywhere.** Only Dropbox Brand and Shopify Editions handle it properly. Doing it well is an easy way to stand out for Review.

## 1. Benchmark: 12 sites, 2024 to 2026

| # | Site | Award / acclaim (proof) | Signature moment | Technique | Reduced motion | What we could borrow |
|---|---|---|---|---|---|---|
| 1 | **Terminal Industries**, by REJOUICE and PROPAGANDE. https://terminal-industries.com | Awwwards SOTD 3 Sep 2025 + Developer Award; SOTM Sep 2025 (https://www.awwwards.com/sites/terminal-industries) | Explains an AI "Yard Operating System" as a physical flow: At the Gate → In the Yard → At the Dock → Across Operations, with numbered steps (Aggregate, Analyze, Activate, Automate) and a live efficiency calculator | Nuxt, GSAP ScrollTrigger, Lenis, View Transitions API; scroll-scrubbed video *(inferred)* | Partial: CSS cuts reveals to a 0.15 s fade; scrolling not gated | **Closest analogue to our story.** An AI system explained as stations and literal gates. Agents as stations, human gates as real gates, plus a small "run a sample brief" widget |
| 2 | **Stripe BFCM Machine**. https://bfcm.stripe.com/ | Awwwards SOTD 8 Jan 2025 + Developer Award + Typography Honors (https://www.awwwards.com/sites/stripe-bfcm-machine) | A custom physical machine, livestreamed for 96 hours, showed live transaction data under a typographic HUD (heads-up display); a 3D "user manual" is the navigation | Augmented video, typographic HUD, fallback data screen | Not found (a static fallback screen exists) | The pipeline as **one machine with an operator's manual**. Agents are labelled modules, a HUD shows stage readouts, gates are switches. The fallback screen is a model for our reduced-motion state |
| 3 | **Dropbox Brand**, by Daybreak Studio. https://brand.dropbox.com/ | Awwwards SOTD 12 Feb 2025 + Developer Award, SOTM Feb 2025 (https://www.awwwards.com/sites/dropbox-brand); two 2025 Webbys (https://winners.webbyawards.com/2025/websites-and-mobile-sites/features-design/best-user-experience/333662/dropbox-brand-website) | A brand system explained through toys: a Bézier editor steering a paper plane, variable-font sliders, colour chips, an icon "jackpot" | Webflow + custom JS, Rive state machines, Lottie. Content and layout first, motion last, paced as "peaks and pauses" (https://www.awwwards.com/case-study-dropbox-brand-guidelines.html) | **Yes**: checks `prefers-reduced-motion` before transitions | The **peaks-and-pauses rhythm** (six agent peaks, four gate pauses). Explain a system with toys, not paragraphs |
| 4 | **Shopify Editions Winter '26, "The Renaissance Edition"**. https://www.shopify.com/editions/winter2026 | Awwwards SOTD 9 Feb 2026 + Developer Award (animations 9.4), SOTM Feb 2026 (https://www.awwwards.com/sites/the-renaissance-edition) | 150+ product updates told through generative Renaissance-style paintings mixed with UI, with a sticky 12-chapter index and "Back to navigation" from every chapter | React/Remix, WebGL/Three.js, Lenis, Blender | **Yes**: a global reduced-motion store; easing jumps to the end and video is gated *(inferred from minified code)* | **Generated imagery as the art direction**, which fits our ComfyUI pipeline. A sticky index of 6 agents + 4 gates, with "back to the map" from each stage |
| 5 | **Igloo Inc**, by abeto with Bureaux. https://www.igloo.inc/ | **Awwwards Site of the Year 2024**; SOTD 23 Jul 2024 + Developer Award (https://www.awwwards.com/sites/igloo-inc) | Each project is frozen inside a block of ice, and the scroll loops forever: igloo → ice → portal → particles → igloo | Three.js, three-mesh-bvh, Svelte, GSAP, procedural ice, sound (https://awwwards.com/igloo-inc-case-study.html) | Not found | A **freeze/thaw metaphor for gates**: the work waits "frozen" at a gate and thaws when the human approves. An endless loop suits "revise" |
| 6 | **Oryzo AI**, by Lusion. https://oryzo.ai | Awwwards SOTD 13 Apr 2026 + Developer Award, SOTM Apr 2026 (https://www.awwwards.com/sites/oryzo-ai) | A deadpan AI launch for a cork coaster: cinematic 3D product, "Pro Max" tier, spec table ("Updates: Never"), a mock research paper with limitations and BibTeX | **Astro**, Three.js, GSAP; 7-part making-of (https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction) | Not found | Proof that **Astro** carries award-level work. An **honest spec sheet per agent** (inputs, outputs, limits, which gate reviews it). Wit helps: the voice can be dry and funny |
| 7 | **Why Zero**, by Sindhur Dutta. https://why.zero.university/ | Awwwards SOTD 7 Sep 2026 + Developer Award, SOTM Sep 2026 (https://www.awwwards.com/sites/why-zero) | A single-page, scroll-scrubbed 3D argument in numbered stages, with a **ruler-style progress nav** and an auto-scroll mode | Three.js, GSAP ScrollTrigger, Blender, device quality tiers | Minimal (only the audio waveform) | A **ruler marked 1 to 6 with G1 to G4 ticks** as our progress rail. An auto-play mode for people who'd rather watch |
| 8 | **Anime.js v4**, by Julian Garnier. https://animejs.com | Awwwards SOTD 6 May 2025 + Developer Award, SOTM May 2025 (https://www.awwwards.com/sites/anime-js) | A dev-tool launch where each module shows its code snippet beside the animation it makes | Anime.js itself *(inferred)*, SVG `createDrawable`, Three.js instancing | Not found | **Show each agent's real input and output beside its animation**, so motion is proof, not decoration |
| 9 | **Abortion Mazes**, The Pudding. https://pudding.cool/2024/10/abortion-mazes/ | Cited by the jury when The Pudding won the 2025 Online Journalism Award for visual storytelling (https://awards.journalists.org/entries/the-pudding-4/) | Each US state's abortion laws become a maze you solve yourself, sized by a complexity score; a counter reads "0/51 completed" | Line illustration, algorithmically generated mazes, scrolling essay; skip link and labels | Not found | **The visitor travels the path.** Gates are where the path forks. A "your project: step 3 of 6" counter |
| 10 | **"Prompt caching: 10x cheaper LLM tokens, but how?"**, by Sam Rose for ngrok. https://ngrok.com/blog/prompt-caching | Simon Willison: one of the clearest introductions to LLM internals (https://simonwillison.net/2025/Dec/19/sam-rose-llms/) | You press play and an attention grid fills token by token; a cache view cycles through shared prefixes | Small inline explorables with play buttons | Animation waits for a click, which is reduced-motion-friendly by design | **One small widget per stage that the visitor triggers**: "send prompt" fans Research out, "run review" plays the audit. Click-to-start keeps motion opt-in |
| 11 | **Dictionary of Free Speech**, by Adrián Gubrica. https://freespeech.gubrica.com/ | Awwwards SOTD 8 Aug 2024 + Typography Honors + Developer Award (https://www.awwwards.com/sites/dictionary-of-free-speech) | A type-led interactive dictionary in chapters on near-black, driven by mouse interaction | Typography plus effects (some 3D) | Not found | **Agents as dictionary entries** (term, part of speech, definition). Type alone can carry the identity, which fits direction A, the Studio Book |
| 12 | **scroll-driven-animations.style**, by Bramus Van Damme (Chrome DevRel). https://scroll-driven-animations.style/ | Official demo site of Chrome's scroll-driven animations course (https://developer.chrome.com/blog/scroll-driven-animations-video-course) | Stacking cards, cover flow, horizontal sections and a timeline, each pure CSS with an explainer box | CSS `scroll()`/`view()` timelines, a WAAPI version, a polyfill; Apache-2.0 | Not found | A **0 KB toolkit**. Stacking cards suit the 3 directions and 3 variations; a scroll-progress line suits the pipeline rail |

**Not included:** the Awwwards 2025 Site of the Year (Lando Norris) and Developer Site of the Year (abeto's Messenger). Both are award-level but not explainers. Linear, Vercel Ship, Stripe Sessions, Resend and Raycast didn't appear on the Site of the Month or Year lists checked.

## 2. Techniques shortlist (cost for Astro 7 on Vercel)

Sizes are gzipped, measured from jsDelivr builds on 2026-11-01. "Cost" means build effort.

| # | Technique | Seen in | Size | Cost | Reduced-motion approach | Gotchas |
|---|---|---|---|---|---|---|
| 1 | **SVG path drawing** (stroke-dashoffset, `pathLength="1"`), driven by scroll | Anime.js, Pudding | 0 KB | Low | Show the path fully drawn | Scaled strokes need `vector-effect`. **The best fit for the double-diamond spine** |
| 2 | **CSS scroll-driven animations + sticky stages** (`animation-timeline: view()`) | Bramus demos | 0 KB | Low | Wrap the motion in `@media (prefers-reduced-motion: no-preference)` | Chrome 115+, Safari 26+, Firefox 159+; check Firefox stable status at build time. Use `@supports` and keep content visible without it. Firefox may need a JS fallback |
| 3 | **Scroll-scrubbed stage manager** with a ruler or progress nav (GSAP ScrollTrigger; Lenis optional) | Why Zero, Terminal, Igloo | GSAP ~28 KB + ScrollTrigger ~18 KB; Lenis ~5 KB | Medium | `gsap.matchMedia()`; don't initialise Lenis | GSAP is free (including plugins) since 30 Apr 2025, but **not open source**: its licence bars use in no-code visual builders that compete with Webflow (https://gsap.com/standard-license). Fine on our site *(inferred)*; **don't bundle GSAP into the kit's templates** without the PM checking. Lenis clashes with `position: sticky` and anchor links |
| 4 | **View Transitions** between states or pages (morph the diagram, switch chapters, re-skin the page) | Terminal Industries | 0 KB native | Low to medium | Astro's `<ClientRouter />` turns animations off under reduced motion | Cross-document transitions work in Chrome 126+ and Safari 18.2+; Firefox is partial. Scripts must re-initialise after navigation (https://docs.astro.build/en/guides/view-transitions/) |
| 5 | **Interactive toys / explorables** (click-to-play widgets, state machines) | Dropbox (Rive), ngrok, Pudding | Hand-made: ~0 to 5 KB. Rive: ~119 to 149 KB JS + 340 to 912 KB WASM. Lottie light: ~46 KB | Medium (Rive needs its editor) | Click-to-start; jump to the end state | Rive's WASM weighs down mobile. Hand-built SVG/DOM toys are cheaper and more accessible |
| 6 | **Typographic HUD / kinetic type** (split text, mono readouts, labels as UI) | Stripe BFCM, Dictionary of Free Speech, Anime.js | GSAP SplitText ~3.6 KB, or CSS only | Low | Static text | Keep the real text in the DOM for screen readers; animate spans with `aria-hidden` copies |
| 7 | **Generated imagery as the art direction** (paintings, renders, textures from our own ComfyUI) | Shopify Renaissance, Igloo | 0 KB JS; image weight | Medium (Concept) | n/a | Needs consistent sets (WEB2 style-match). Images can't carry readable text. A Klein disclosure is required (Q11) |
| 8 | **WebGL hero or set piece** (Three.js or OGL) | Igloo, Oryzo, Why Zero, Shopify | Three ~89 KB; OGL ~39 KB or less | High | Render a static frame | GPU strain on phones, fallbacks, shader time. Use it for **one** set piece at most, if any |

**Cheapest high-impact stack:** 1 + 2 + 4 (0 KB), plus GSAP for the one scrubbed set piece where CSS isn't enough. Add 5 for the gate interactions.

## 3. Three set-piece ideas for this site

These are inspired by the benchmark, not copies. Each has a no-motion version that tells the same story.

### Set piece 1: "The sentence travels"

*The prompt moving through the double diamond.*

- **The moment:** The hero sets the human's sentence in large type. As you scroll, the words lift off and condense into a single glowing **token**, which drops onto the double diamond and travels along it.
- **The first diamond:** the path splits into many faint threads (Research reading 8 sites, 20 references), then converges to a point.
- **At each gate** the token stops at a physical checkpoint, a lever or a stamp, until you scroll on. At G2 and G3 the path visibly **forks into three** before converging.
- **Revise loop:** a small "revise" control sends the token round a loop-back arc once, so you see that the process isn't linear.
- **Technique:** SVG path drawing on a CSS scroll timeline (1, 2). Split type for the sentence (6). A GSAP fallback for browsers without scroll timelines (3).
- **Borrowed from:** Terminal Industries' gates, Pudding's path you travel, Why Zero's ruler (the diamond doubles as the progress rail).
- **Reduced motion / no JS:** the full diagram is drawn, the token sits at the current chapter, and the "revise" arc is shown as a dashed line with a label.

### Set piece 2: "Six desks, one clock"

*Six agents working in parallel.*

- **The moment:** A full-viewport board of **six desks**: one lane or window per agent (PM, Research, Concept, Front-end, Backend, Review). Scrolling scrubs a shared **clock**, and as it runs:
  - each desk writes its files (filenames type out in mono);
  - small briefs fly from the PM's desk and DONE notes fly back;
  - Concept's desk develops images like a darkroom, using our real generated art;
  - Front-end's desk shows three browser windows at once (worktrees).
- **Spec sheets:** click a desk to open its **spec sheet**: inputs, outputs, what it owns, what it can't do, which gate reviews it.
- **Technique:** a GSAP ScrollTrigger scrub (3) over DOM/SVG desks, a typographic HUD (6), and a View Transition into the spec sheet (4).
- **Borrowed from:** Stripe BFCM's machine and HUD, Oryzo's deadpan spec table, Cursor's status board (`competitors.md`).
- **Reduced motion / no JS:** the board at "end of day", with every file listed, plus a plain timeline list underneath. The clock becomes a list of timestamps written for the story; no real timings (Q6).

### Set piece 3: "You are the human"

*Four gates as checkpoints the visitor operates.*

- **The moment:** Each gate is a full-viewport **pause**, the "peak and pause" rhythm. The story stops, and the visitor is handed the human's packet.
- **G2: three creative directions** on stacking cards. When you pick one, the page **re-skins itself in that direction** for the next chapter through a View Transition (palette, type and art swap). Then a note: "The human picked B. Here's why." Dialogue is written for the story (Q5).
- **G3: three coded variations** side by side at phone and desktop size. You can toggle between them.
- **G1 and G4:** simpler checkpoints, approve or "revise", with a short consequence each.
- **Technique:** stacking cards (2, 12), View Transitions for the re-skin (4), hand-built toys for the choices (5). Generated art from all three directions (7).
- **Borrowed from:** Dropbox's toys and pauses, Igloo's freeze/thaw (the work waits "frozen" at a gate until you choose), ngrok's click-to-play.
- **Why it's the strongest showcase:** the site literally **demonstrates its own variations**. It proves "three directions, three variations" by letting you wear them.
- **Reduced motion / no JS:** the three options are shown as a static row of style tiles with the chosen one marked. The re-skin becomes an instant switch, and without JS the page simply shows all three.
- **Cost warning:** set piece 3 is the most expensive. The re-skin needs all three directions' tokens built as CSS themes, which needs Front-end and Concept to plan early.

## Sources not repeated above

- Award pages and case studies are linked in each row.
- Library sizes: npm registry versions (GSAP 3.15.0, Lenis 1.3.27, three 0.187, OGL 1.0.11, @rive-app/canvas 2.49.0, lottie-web 5.13.0, motion 14.9.0), gzipped from jsDelivr.
- Browser support: https://caniuse.com/mdn-css_properties_animation-timeline, https://caniuse.com/cross-document-view-transitions.
