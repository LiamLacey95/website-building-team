# Report 05-frontend-product-and-scaffold (Front-end)

State: DONE. Date: 2026-11-01. Everything is on `master`, committed with a pathspec.

## 1. `/impeccable init` → `PRODUCT.md`

`projects/how-it-works/PRODUCT.md` follows Impeccable's product schema 1. Sources:
- `BRIEF.md`;
- `research/SUMMARY.md`, `personas.md` and `define/`;
- `gates/G1-strategy/DECISION.md`, which wins on any conflict.

What it records:
- **The success measure, in the human's own words:** creativity, interest and polish.
- **Product Principle 2:** "Creativity is the measure. A safe, generic explainer fails the brief even if it is correct."
- **The Gate 1 constraints:**
  - story-written dialogue (Q5);
  - no time or cost figures (Q6);
  - a plain NVIDIA statement (Q7);
  - no analytics (Q9);
  - Klein allowed (Q11);
  - Vercel at the root;
  - the relaxed JS budget.
- **The stack:** Astro 7, Vercel, relaxed JS.
- **Must not be fabricated:** testimonials, star counts, unmeasured scores, time or cost, and GPU-free claims.

**How the interview was answered.** Init normally interviews the user. I didn't contact the human: the playbook routes all of that through the PM and the gates. The interview was answered by the human's Gate 1 decisions, which are confirmed answers to exactly init's questions. Init's own rule allows that ("ask only about material gaps the repository and original request do not answer with strong evidence"). The substitution is stated at the top of `PRODUCT.md`, and the one inferred fact is marked *(inferred)*.

**Other init steps:**
- *Build path:* no image-generation tool exists in this harness, so the work is code-first by default. Nothing is written to `.impeccable/config.json`.
- *Live mode:* not configured, because it isn't part of our workflow.

**Context resolution (verified).** `impeccable context --target projects/how-it-works/...` resolves `projectRoot` to `projects/how-it-works`, `productPath` to `PRODUCT.md` and `platform` to `web`. The next directive is `WORLD_DISCOVERY_REQUIRED`, which is expected: the visual world is chosen at Gate 2 and recorded with `/impeccable document`.

## 2. Scaffold: `projects/how-it-works/web/`

**Stack:**
- Astro **7.4.4**, TypeScript 6.0.3 strict, and `@astrojs/check` 0.9.12. TypeScript 7 isn't supported by `@astrojs/check` yet.
- `@types/node`, and `ogl` 1.0.11, used only by the spikes.
- All versions are pinned exactly, with a lockfile.
- Static output, no base path, and `site` from `SITE_URL` (a placeholder until the Vercel domain exists).

**Routes:**
- `/`: hero, chapter nav and the 9 chapter sections from `story-outline.md`; gate chapters say "arrives at Gate N";
- `/made/`, `/setup/` and `/credits/`, with placeholder sections from `sitemap.md`;
- `404`;
- `/llms.txt` (text/plain) and `/story.md` (text/markdown), both generated from the same data.

**Tokens.** `src/styles/tokens.css` is the one file a direction replaces: colour, fluid type scale, space, radius and motion. The neutral placeholder values are contrast-checked:

| Pair | Contrast |
|---|---|
| ink on paper | 16.4:1 |
| muted on paper | 7.5:1 |
| accent on paper | 6.1:1 |
| white on accent | 6.7:1 |

**Components:**
- **`SetupSentence.astro`:** a selectable `<code>` with a "select and copy" hint when JS is off. With JS, a Copy button appears, writes to the clipboard and announces "copied" in a live region. If the clipboard is blocked, it selects the text and says so.
- **`MotionToggle.astro`:** the "Reduce motion" toggle. It uses `aria-pressed` and sets `data-motion="off"` on `<html>`. The choice is saved in localStorage and applied before first paint by an inline head snippet, which the CSP hashes.
- **`site.ts`:** one module that handles both.
- **`global.css`:** the safety net. Motion is off under `prefers-reduced-motion` or `data-motion="off"`.

**CSP.** Astro's `security.csp` emits a meta tag with per-page script and style hashes. Shiki highlighting is disabled because its inline styles break the CSP (Astro warned about it).

**Scripts:** `npm run dev`, `build`, `preview`, `check` and `spikes`. `web/README.md` documents the structure and rules.

**Verified:**
- `astro check`: 0 errors, 0 warnings, 0 hints.
- Build: 5 pages plus 2 endpoints.
- A Playwright behaviour check passed **17 of 17**:
  - no CSP violations on 5 routes;
  - copy writes the exact sentence, announces it, and says "Copied";
  - the motion toggle works, persists across pages and switches back off;
  - skip link first in the Tab order, and focus moves to `<main>`;
  - with JS off, the button and toggle are hidden and the hint is shown;
  - `/llms.txt` and `/story.md` are served with the right types;
  - unknown routes return 404.
- **Impeccable detect:**
  - The source scan is clean.
  - The rendered pages are clean: 0 findings on all 4 routes at desktop width, plus `/` and `/made/` at 390 px. These are URL scans in a real browser.
  - A file scan of `dist/` reports `cramped-padding` false positives, because it can't load root-relative `/_astro/*.css`. Scan the served URL, not `dist/`, for built pages.

## 3. Set-piece techniques

All three Concept directions are in flight: A Paper Trail, B Signal Path, C Marble Run.

**What each direction will ask for:**
- **A:** a scroll-drawn pencil diamond, a stamp press and type-on text.
- **B:** a canvas oscilloscope plotted from scroll position, a sticky screen and a guarded switch.
- **C:** a marble following the track path on scroll, and a cast of images.

**Common to all:** cross-page view transitions, and possibly a WebGL texture layer.

**How the spikes are built.** All spikes live in `web/src/spikes/` behind a flag: `/spikes/<name>/` pages are generated only when `SPIKES=1` (`npm run spikes`). A normal build contains none, which I verified (5 pages, no `/spikes/`). Each spike was tested in Chromium 156 with motion on and with reduced motion. Result: **16 of 16 checks pass**, with no console errors or CSP violations.

| Technique | For | Result | JS cost (gzip, over the 0.7 KB site baseline) |
|---|---|---|---|
| Scroll-drawn SVG path (`stroke-dashoffset` on a view timeline, `pathLength=1`) | A; the spine of all three | Works; responsive; motion off = fully drawn | **0 KB** |
| Object following a path on scroll, CSS (`offset-path` plus a scroll timeline) | C | Works, but only in Chromium today: scaling `path()` px coordinates needs typed `calc()` division | **0 KB** |
| Object following a path on scroll, JS (`getPointAtLength` → CSS variables via CSSOM) | C | Works everywhere; responsive by construction; **recommended** | **0.4 KB** |
| Canvas trace plotted from scroll progress (sticky, DPR-aware, redraws only on scroll) | B | Works; `aria-hidden` with a text equivalent; motion off = one complete static frame | **0.6 KB** |
| Stamp press or guarded switch (`button[aria-pressed]`, 120 ms keyframe, SVG impression) plus a CSS type-on line | A, B | Works by keyboard; the full text is always in the DOM | **0.2 KB** |
| WebGL shader plane via **OGL** (Unlicense), lazy-loaded near the viewport, paused off-screen, one frame when motion is off, CSS fallback without WebGL | any texture layer (paper grain, CRT glow) | Works | **1.6 KB** loader, plus the **12.6 KB** OGL chunk loaded on demand. Importing individual OGL modules would trim it. three.js would be much larger |
| Cross-document View Transitions (`@view-transition`, shared `view-transition-name`) | all | Works; the on-page toggle cancels the animation | **0 KB** |

Evidence shots are in `screenshots/2026-11-01/spikes/`.

**Rules found while spiking.** All three are written into `web/src/styles/global.css` and `web/README.md`. Without the spikes, Gate 3 would have shipped silently broken motion.

1. **Astro's scoped styles break root conditions.** `:root:not([data-motion='off']) .x` is scoped to `:root:not(...)[data-astro-cid]`, which never matches `<html>`.
   - *Fix:* `:global(:root:not([data-motion='off'])) .x`.
2. **The CSS minifier (Lightning CSS, Vite's default) rewrites scroll-driven CSS:**
   - It folds `animation` and `animation-timeline` into one shorthand that Chromium rejects, so the animation is silently dropped.
   - It mangles `animation-range: entry 0% exit 100%` into `entry exit 0%`, which is the wrong range.
   - *Fix:* write longhands (`animation-name`, `-timing-function`, `-fill-mode`, `-timeline`, `-range-start`, `-range-end`), and check the compiled CSS.
   - *Not adopted:* switching to esbuild, because this Vite no longer bundles it and it would be an extra dependency.
3. **An animated element must not be its own `view()` subject,** or its progress runs away as it moves.
   - *Fix:* put a named `view-timeline-name` on a static container, and have everything in the set piece read from it.

## 4. Impeccable hook: it fires in this session

I wrote a deliberately bad file to `projects/how-it-works/web/src/pages/_hooktest.astro`. The PostToolUse hook immediately returned:

> `[impeccable@1] Design hook findings requiring review in projects/how-it-works/web/src/pages/_hooktest.astro (1 issue(s)): L5 [gradient-text] Gradient text…`

So the gated hook (`tools/impeccable-hook.mjs`) is active in this thread and scans site edits. The file was a test fixture: I deleted it rather than adding an ignore. Clean edits stay silent (quiet mode). **No fresh Front-end thread is needed before Gate 3.**

## 5. First visual-history entry

- `screenshots/2026-11-01/1714-master-scaffold-{home,made,setup,credits}-{390,768,1440,1920}.png` (16 shots plus `manifest.json`), taken with `tools/screenshot.mjs` against `astro preview` on port 4330. Ports 4321-4323 stay free for the Gate 3 variants.
- **One fix after the first look:** on `/setup/`, the sentence block sat flush against the first section rule. It now has a 64 px gap (measured), and the shots were retaken.

## Backend coordination

I messaged Backend about its draft `server/contracts/schema.ts`:
1. **`chapterSchema.kicker`:** make it optional or drop it. Impeccable bans eyebrows above headings, and phase and gate already carry that information.
2. **Vercel CSP header:** carry only `frame-ancestors` and similar directives. Leave `script-src` and `style-src` to Astro's hashed meta tag, because a header can't hold per-page hashes.
3. **Wiring:** I'll write `content.config.ts` and add `vite.resolve.dedupe: ['zod']` once `api/contract.md` lands. Until then the scaffold reads `src/data/site.ts`, which uses the same field names.
4. **`gpuNotice`:** becomes a `SetupSentence` prop.
5. **Filled image slots:** keep intrinsic dimensions so CLS stays at 0.
6. **Stable fields:** keep `diamond` and `gate` stable.

## Open items

- **Wire the content collections** when Backend publishes the contract. This is a small change: the components already take props.
- **Replace `tokens.css` and the system font stacks** with the chosen direction at Gate 2/3. Then self-host the faces: Concept's `_fonts/` has the OFL licence texts.
- **Gate 3 needs one setup step:** each variant worktree needs `npm ci` in `projects/how-it-works/web`.

## Addenda (after DONE)

### CSP moved to a real header (with Backend)

Backend's contract puts the CSP in a Vercel header (`script-src 'self'; style-src 'self'`, no hashes), which is stricter than the meta tag. Commit 2c74ad3 makes `web/` comply:
- Astro's `security.csp` meta is removed, so there is one policy, the header.
- `build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0`: Astro had been inlining the small `site.ts` module and one stylesheet.
- The pre-paint snippet is now `public/motion.js`.

The built pages contain 0 inline scripts, styles or `style=` attributes. The behaviour suite passes with the header injected on every response, with 0 CSP violations. `projects/how-it-works/vercel.json` is Backend's; `web/` is entirely Front-end's.

### Several themes at once (PM note on Research's set piece 3)

"You are the human" re-skins the page in the chosen G2 direction, so the token layer must hold several themes at once.

**How it works:**
- `tokens.css` holds the **base** tokens on `:root`. A **derived** block on `:root, [data-theme]` recomputes in every themed subtree, because custom properties inherit computed values.
- `styles/themes/<slug>.css` holds one `[data-theme='<slug>']` block per direction. It is empty until Gate 2.
- In `global.css`, `[data-theme]` re-applies color, background and font.

**Spike `/spikes/themes/`** (behind `SPIKES=1`). Three placeholder themes are shown side by side, and choosing one re-skins `<main>` through a same-document View Transition (about 0.3 KB JS).

**Tested under the header CSP, with motion on and reduced (12 of 12 checks):**
- the three scopes compute distinct colours;
- links take their own theme's accent;
- the derived `--color-focus` equals each theme's accent;
- the re-skin works and is announced;
- there are 0 errors.

Evidence: `screenshots/2026-11-01/spikes/1720-spike-themes-reskinned-1280.png`.

**GSAP** may be used inside `web/` if a scrubbed set piece needs it (about 28 KB plus 18 KB for ScrollTrigger, self-hosted, which is fine under the CSP). It never goes into the kit's `tools/` or templates (DECISIONS, 2026-11-01).

### Content contract 0.2.0 wired

Backend's collections are now wired: `web/src/content.config.ts` follows the contract's snippet, with `vite.resolve.dedupe: ['zod']` and `server.fs.allow: ['..']` (nothing above `projects/how-it-works`). `src/data/site.ts` is removed.

**Pages:**
- Home renders the hero and chapters 1 to 9 from `chapters`: rendered bodies, scenes, artefacts (file, terminal, slot, diagram) and gate cards.
- `/setup/` renders requirements (inline Markdown via `inlineMd`), steps, commands, the real `--check` output and the FAQ.
- `/credits/` and `/made/` render roles, gates, slots and numbers.
- `/llms.txt` and `/story.md` render from the same collections.

**Images.** Filled slots render through `<Picture>`:
- formats AVIF and WebP, with `fallbackFormat` WebP;
- widths 400, 800, 1200 and 1600, capped at each master's size;
- `sizes` set, and lazy loading.

**Checks:**
- `astro check`: 0 errors.
- Backend's `check-dist`: clean (header CSP plus meta, paths, budget) in both auto and `CONTENT_SLOTS=filled` modes.
- `<picture>` output has 0 `style=` attributes.
- Behaviour suite under the header CSP: all pass (its only non-PASS line is the deliberate `/nope` 404).

**Detector, on rendered pages at 390, 768, 1440 and 1920 px:** 0 findings, after two fixes.
- **Stragglers:** `text-wrap: pretty` now also covers `li`, `dd`, `figcaption`, table cells and `summary`.
- **Line length:** `--measure` went from 68ch to 60ch (about 72 to 78 characters).
- **One advisory left, judged a false positive:** `em-dash-overuse` on `/setup/`. The detector counts `--` in command-line flags inside `<code>` (`--check`, `--yes`, `--skip-comfyui`). There are no em-dashes in the copy.

**Visual history:** `screenshots/2026-11-01/1726-master-content-*` (16 shots, real mode, all slots pending).

**Copy flags sent to Backend (G1 Q6, no time or cost):**
- "what it costs" in the G1 packet and in chapter 4;
- "the same afternoon" in the G1 revise outcome.

**Typing:** `slotSchema(image)` types `src` as `unknown`. `Slot.astro` casts it to `ImageMetadata` for now, and I've asked Backend to make the helper generic.
