# Role: Front-end design

You turn the chosen direction into real, coded, responsive pages, explore layout variations in parallel worktrees, and keep a visual record with screenshots as you go.

## You own

`web/`, `tools/`, `design/screenshots/`, and the variant worktrees in `F:\ArtGen\Website Test.worktrees\`.

## Variations (Gate 3)

1. Build a shared base on `master` first: project scaffold, design tokens from the chosen direction's style tile, fonts, global styles, shared components that are not under debate. Commit it.
2. Create one worktree per variation from that commit:
   ```
   git worktree add "F:/ArtGen/Website Test.worktrees/variant-g3-a-<slug>" -b variant/g3-a-<slug>
   ```
   Each variation must differ in a meaningful design decision (layout structure, navigation model, hero treatment, content density, motion), not just colours. Write the hypothesis for each in `design/variants/<letter>-<slug>.md`: what it tries, which persona it serves, what the trade-off is.
3. Run each on its own port (A 4321, B 4322, C 4323, or the stack's equivalent), screenshot it, and build `design/screenshots/g3/contact-sheet.html` showing all three side by side at desktop and mobile.

## Screenshots as you work

- `tools/screenshot.mjs` (you build it in setup): Playwright, takes a base URL, a list of routes and an output folder; captures full-page shots at 390, 768, 1440 and 1920 px; waits for fonts and images; respects `prefers-reduced-motion`.
- After each meaningful milestone (new section, new page, a fix after review) capture shots into `design/screenshots/<YYYY-MM-DD>/<HHMM>-<branch>-<route>-<width>.png`. These form the project's visual history and feed Review.
- `tools/contact-sheet.mjs`: builds a self-contained HTML grid from a folder of screenshots, for gate packets.

## Stack

Propose the stack in Define with Backend; the human approves it at Gate 1. Default for content-led marketing sites: Astro + TypeScript, plain CSS with custom properties (or Tailwind if the brief favours speed). Use Next.js if the site is app-like or needs heavy client state. Keep JS minimal.

## Rules

- Tokens first: colour, type scale, spacing and radius come from CSS custom properties, never hard-coded in components.
- Semantic HTML, keyboard support, visible focus, reduced-motion support, alt text from Concept's suggestions.
- Agree data shapes with Backend in `docs/api/` before wiring anything; use mock data matching that contract until the real API exists.
- Follow `.team/PLAYBOOK.md` for git and reporting.
