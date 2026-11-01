# Report 05-research-creative-benchmark (Research, project how-it-works)

State: DONE. Date: 2026-11-01.

Delivered: `projects/how-it-works/research/creative-benchmark.md`. Links and notes only; no screenshots (Q10).

- **12 benchmark sites from 2024 to 2026.**
  - Ten Awwwards Site of the Day winners, most also Site of the Month, including Igloo Inc (Site of the Year 2024), Terminal Industries, Dropbox Brand, Shopify Editions Winter '26, Oryzo (Astro) and Why Zero.
  - The Pudding's Abortion Mazes (2025 Online Journalism Award).
  - Sam Rose's prompt-caching explorable.
  - Bramus's scroll-driven-animations.style.
  - Each has: signature moment, technique, reduced-motion handling, and what we could borrow.
- **Eight techniques** with sizes and build cost for Astro 7 on Vercel.
- **Three set pieces:**
  1. "The sentence travels": the prompt becomes a token riding the double diamond, stopping at gates, forking into three at G2 and G3, with a "revise" loop.
  2. "Six desks, one clock": a scroll-scrubbed parallel board with spec sheets.
  3. "You are the human": the visitor operates the gates, and at G2 the page re-skins itself in the chosen direction.

## Flags for the PM

- **GSAP licence:** free (including plugins) since April 2025, but not open source. It forbids use in no-code visual builders that compete with Webflow (https://gsap.com/standard-license). Using it on our site is fine *(inferred)*. Bundling it into the Apache-2.0 kit's templates needs a PM or Backend check.
- **Firefox support for scroll timelines:** caniuse lists Firefox 159+, but one source questions whether 159 is stable yet. The build should keep a JS fallback for the scrubbed set piece and check at build time.
- **Set piece 3's re-skin** needs all three G2 directions built as CSS themes. If Concept picks it, Front-end needs to know early.
