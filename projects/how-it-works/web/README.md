# how-it-works / web

The Website Building Team's own site. Astro 7, TypeScript, static output, deployed to Vercel at the site root (Gate 1 decision). Front-end owns this folder; see `../PRODUCT.md` for the product record.

```bash
npm ci
npm run dev        # http://localhost:4321 (use another port while Gate 3 variants own 4321-4323: npm run dev -- --port 4330)
npm run build      # -> dist/
npm run preview
npm run check      # astro check (types)
npm run spikes     # dev server with the set-piece spikes enabled: /spikes/<name>/
```

## Structure

| Path | What |
|---|---|
| `src/styles/tokens.css` | **The one file a direction replaces.** Colour, type, space, radius and motion tokens. Neutral placeholders until Gate 2/3 |
| `src/styles/themes/` | Extra themes, one `[data-theme='<slug>']` file per direction, for a set piece that shows or switches several directions at once. Empty until Gate 2 |
| `src/styles/global.css` | Reset, base elements, focus, skip link, the motion-off safety net, and the motion authoring rules |
| `src/layouts/Base.astro` | Head, the pre-paint motion script (`public/motion.js`), header (wordmark, nav, Reduce motion), footer |
| `src/components/SetupSentence.astro` | The setup sentence with an accessible copy button (works without JS) |
| `src/components/MotionToggle.astro` | The "Reduce motion" toggle |
| `src/scripts/site.ts` | The one site-wide module: copy button and motion toggle |
| `src/data/site.ts` | Placeholder working copy until Backend's content model (`../api/contract.md`) lands |
| `src/pages/` | `/`, `/made/`, `/setup/`, `/credits/`, `404`, `/llms.txt`, `/story.md` |
| `src/spikes/`, `src/pages/spikes/` | Technique spikes. Pages are generated **only** when `SPIKES=1`, so normal builds contain none |

## Rules

- Tokens only: components never hard-code colour, type, space, radius or motion.
- Themes: a theme file overrides **base** tokens only. Anything derived from another token goes in the `:root, [data-theme]` block in `tokens.css`, so it recomputes inside every themed subtree. Any element with `data-theme` re-applies colour, background and font (see `global.css`). Put `data-theme` on `<html>` to re-skin the whole page.
- GSAP may be used here in `web/` if a set piece needs it, but never in the kit's `tools/` or templates (licence; see `.team/DECISIONS.md`).
- **CSP is a real HTTP header** (`vercel.json`, owned by Backend): `script-src 'self'; style-src 'self'`, no hashes. So **nothing inline**: no inline `<script>` (the pre-paint motion snippet is `public/motion.js`), no `<style>` in the HTML (`build.inlineStylesheets: 'never'`, `assetsInlineLimit: 0`), no `style=""` attributes, no `define:vars`, no inline event handlers. Runtime values go through the CSSOM (`el.style.setProperty`), which the CSP allows. `astro preview` doesn't send the header; test with it injected (see the brief 05 report).
- Motion is always optional: `prefers-reduced-motion` and the on-page toggle (`data-motion="off"` on `<html>`) both turn it off, and no content depends on it.
- Read the motion authoring rules in `src/styles/global.css` before writing any scroll-driven CSS. The CSS minifier rewrites some of it.
