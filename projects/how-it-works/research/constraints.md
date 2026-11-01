# Constraints: how-it-works

Checked 2026-11-01. Facts carry a URL; guesses are marked *(inferred)*.

## Accessibility (WCAG 2.2 AA, plus the scroll-storytelling specifics)

### Success criteria that bite hardest on an animated, scroll-driven story

| SC | Level | What it means for us | Source |
|---|---|---|---|
| 2.2.2 Pause, Stop, Hide | A | Motion that starts automatically, lasts over 5 s and runs alongside other content needs a pause control. "Scrolling into view" counts as starting automatically. Looping demos and autoplay video need a visible pause | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html |
| 2.3.1 Three Flashes | A | No flashing more than 3 times per second | https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html |
| 2.3.3 Animation from Interactions | AAA (we should meet it anyway) | Motion triggered by scrolling can be turned off. Technique C39 is `prefers-reduced-motion` | https://www.w3.org/WAI/WCAG22/Techniques/css/C39 |
| 1.4.10 Reflow | AA | Usable at 320 CSS px with no two-way scrolling, so pinned or side-by-side panels must stack | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html |
| 2.1.1 Keyboard, 2.4.3 Focus Order | A | Every step and demo reachable by keyboard, with DOM order matching visual order | https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html |
| 2.4.11 Focus Not Obscured (Minimum) | AA | A sticky header or progress bar must not cover the focused element. Use `scroll-padding-top` (C43) | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html |
| 2.5.7 Dragging Movements | AA | Any drag demo, such as a draggable diamond or dial, needs a single-pointer alternative like buttons | https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ |
| 2.5.8 Target Size (Minimum) | AA | Step dots, copy buttons and gate toggles at least 24×24 CSS px | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| 4.1.2 Name, Role, Value | A | Custom controls (play/pause, step navigation, A/B/C choosers) expose name, role and state | https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html |
| 1.1.1 Non-text Content | A | Diagrams and artefact screenshots need real text alternatives, not generic alt text like the Design Council's diagram has | https://www.designcouncil.org.uk/our-resources/the-double-diamond/ |

### Do

- Use native scrolling. Build the story as ordinary text sections in reading order, with graphics as enhancement. A screen reader then gets the whole story without live regions *(inferred; no authoritative guidance on sticky scrollytelling was found)*.
- Make the static version the default. Add motion only inside `@media (prefers-reduced-motion: no-preference)` and `@supports (animation-timeline: view())` (C39; MDN).
- Offer a page-level "Reduce motion" or "Pause" toggle as well as the OS setting. Precedents are Kirby's header toggle (`refs/board/c4-kirby-desktop.webp`), Ciechanowski's pause-all and the Pudding's `MotionToggle` (https://github.com/the-pudding/svelte-starter).
- Give the long page a jump-to-chapter nav and a progress indicator that is real links, not just a decoration.
- Test at 320 px, keyboard only, and with NVDA and VoiceOver. Review's checklists already cover axe, Lighthouse and contrast.

### Don't

- Don't hijack the scroll wheel or change scroll speed. NN/g found it harms control, discoverability and task success (https://www.nngroup.com/articles/scrolljacking-101/).
- Don't hide content at `opacity: 0` until an animation reveals it. Browsers without support would then show nothing.
- Don't use vh-based scroll triggers. They break on mobile (https://pudding.cool/process/responsive-scrollytelling/).
- Don't put information in hover-only states, or meaning only in canvas or WebGL.
- No autoplaying video with sound. Muted autoplay only when motion is allowed, and always with a pause control.

### Browser support for scroll-driven effects

- CSS scroll-driven animations (`animation-timeline: scroll()/view()`) work in Chrome/Edge 115+, Safari 26+ and Firefox 159+, about 88% of global usage (https://caniuse.com/mdn-css_properties_animation-timeline).
  - Firefox 159 turned them on by default on 27 Oct 2026 (https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159).
  - MDN does not yet list them as Baseline.
- Same-document View Transitions work in Chrome 111+, Safari 18+ and Firefox 144+, about 92.9% (https://caniuse.com/view-transitions).
- So we can use CSS-native scroll effects with no animation library. The `@supports` fallback is the static page *(inferred)*. This also helps the 150 KB JS budget.

## GitHub Pages

| Limit | Value | Source |
|---|---|---|
| Published site size | 1 GB max | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits |
| Bandwidth | 100 GB/month, soft limit | same |
| Builds | 10/hour, soft limit (doesn't apply to custom Actions workflows); deploys time out after 10 min | same |
| Files | Git blocks files over 100 MiB and warns over 50 MiB *(not re-checked on the page)* | https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github |
| Use policy | Not for running an online business, e-commerce or SaaS. An open-source project site is fine | https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features |
| HTTPS / custom domain | HTTPS through Let's Encrypt, with "Enforce HTTPS" | https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https |
| Headers | No custom headers. A CSP has to be a `<meta http-equiv>` tag, which can't set `frame-ancestors` or reporting | https://github.com/orgs/community/discussions/54257 |
| Privacy | GitHub logs visitor IP addresses for security, so mention it in the privacy note | https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages |
| Deploy | Use the Actions workflow: `configure-pages`, `upload-pages-artifact`, `deploy-pages` (permissions `pages: write`, `id-token: write`). For Astro, use `withastro/action`, set `site` and `base: '/<repo>'`, and drop `base` if there's a custom domain | https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages, https://docs.astro.build/en/guides/deploy/github/ |

**Implications:**
- A project site lives under `/<repo>/`, so every asset and link must respect the base path.
- Showing real artefacts (PNG screenshots, contact sheets) must stay well under 1 GB. Export as AVIF/WebP and keep the PNG masters in the repo outside the published `dist/` *(inferred)*.

## Licences and attribution

| Item | Licence | What we must do | Source |
|---|---|---|---|
| Impeccable (skills in `.claude/skills/`) | Apache-2.0, with a `NOTICE.md` (it adapts MIT-licensed ehmo platform-design-skills, and started from Anthropic's frontend-design skill) | Keep its LICENSE and NOTICE in the repo, mark any files we changed, and credit it on the site. No trademark rights | https://github.com/pbakaus/impeccable, https://raw.githubusercontent.com/pbakaus/impeccable/main/NOTICE.md, https://www.apache.org/licenses/LICENSE-2.0 |
| FLUX 3 Image Klein (WEB1, 2, 4, 5) | FLUX Kommunity License v1.0 | Commercial use of outputs is allowed only for users with under US$5M gross annual revenue, affiliates included. Outputs may not be used to train competing models. No use of the BFL/FLUX trademarks without permission. State this honestly on the site | https://huggingface.co/black-forest-labs/flux-3-image-klein, https://bfl.ai/blog/flux-3-image-klein |
| Z-Image Turbo (WEB3) | Apache-2.0 | None on outputs. It's the fallback for users over US$5M revenue | https://huggingface.co/Tongyi-MAI/Z-Image-Turbo |
| RealESRGAN x4plus (WEB6b) | BSD-3-Clause | Keep the notice in the repo, and don't imply the authors endorse us | https://github.com/xinntao/Real-ESRGAN/blob/master/LICENSE |
| 4x-UltraSharp (WEB6) | CC BY-NC-SA 4.0 | Boards only. Never use it for anything in `web/` (`generate.py` enforces this) | https://huggingface.co/Kim2091/UltraSharp |
| Double Diamond diagram | CC BY 4.0 | Credit it, for example "Double Diamond by the Design Council, CC BY 4.0", linking the licence, and note that we changed it | https://www.designcouncil.org.uk/our-resources/the-double-diamond/ |
| Web fonts | Prefer SIL OFL families | Self-host them and ship the OFL text. Loading Google Fonts from Google's servers without consent was ruled a GDPR breach (LG München, 20 Jan 2022) | https://openfontlicense.org/ofl-faq/, https://www.uni-regensburg.de/universitaet/aktuelles/nachrichten/nachricht/04-04-2022_dynamische-einbindung-von-google-fonts-ohne-einwilligung-verstoesst-gegen-dsgvo |
| Reference screenshots in `research/refs/` | Third-party copyright | Internal research only. Don't publish them on the site | *(inferred)* |
| Showing third-party UI in our own case study | | If the case study shows research screenshots, use small, cropped, cited thumbnails or links, or leave them out. A licence decision for the human *(inferred)* | |
| AI image authorship | | US copyright still requires a human author (Thaler v. Perlmutter; cert. denied 2 Mar 2026). Say "generated with…" and don't claim copyright over the raw outputs *(inferred)* | https://www.mayerbrown.com/en/insights/publications/2026/03/supreme-court-denies-review-in-ai-authorship-case |

## Cookies and privacy

- If the site stores nothing on the visitor's device (no cookies, localStorage or tracking pixels), the EU ePrivacy Art. 5(3) and UK PECR consent rules don't apply, so no banner is needed *(inferred)*. Tracking pixels and URLs do count (https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf).
- A remembered "reduce motion" preference in localStorage is arguably strictly necessary, because the user asked for it. Alternatively, don't persist it *(inferred)*.
- If analytics are wanted, use a cookieless option:
  - Plausible: no cookies, daily-rotated hash (https://plausible.io/data-policy).
  - GoatCounter: aggregate only (https://www.goatcounter.com/help/gdpr).
- Either way, add a one-paragraph privacy note that also covers GitHub's IP logging.
- Claude Code's and Cursor's pages both open with a cookie dialog. Having none is a small, visible quality difference.

## SEO and sharing

- JSON-LD `SoftwareSourceCode` with `codeRepository`, `programmingLanguage`, `runtimePlatform`, `license` (https://schema.org/SoftwareSourceCode).
- Skip `SoftwareApplication`: Google's rich result needs price and ratings (https://developers.google.com/search/docs/appearance/structured-data/software-app).
- Open Graph `og:title/type/image/url` (https://ogp.me/) and `twitter:card=summary_large_image`, with a 1200x630 card. Concept can make it with WEB1 at 1200x624 cropped to 630 (`artgen/README.md`).
- Search intents to target *(inferred)*: "AI agent team website design", "Claude Code multi-agent website", "ComfyUI website workflow", "Double Diamond AI".
- Server-render or prerender everything. Linear Method's client-only page reads as "Loading…" to fetchers.
- Add `llms.txt` or a markdown twin for agents, following the Factory precedent (https://factory.ai/llms.txt).

## Expected integrations

| Integration | Why | Typical providers | Must/should/could |
|---|---|---|---|
| GitHub repo link and star count | The main conversion is cloning. Stars are the trust signal for open source | GitHub REST API at build time, so there's no client-side call *(inferred)* | must (link), could (live count) |
| Copy-to-clipboard for the setup sentence | The single most important action | native `navigator.clipboard` | must |
| Analytics | Measure whether people copy the instruction | Plausible or GoatCounter (cookieless), or none | could, the human decides |
| CMS | Not needed: content is markdown in the repo | — | no |
| Forms, payments, booking, maps | Not needed | — | no |

## Performance

- The playbook budget applies: LCP < 2.5 s on mobile, CLS < 0.1, JS < 150 KB gzipped.
- No in-browser models and no heavy WebGL on first load (Transformer Explainer's 600 MB model is the cautionary example).
- Lazy-load real artefacts below the fold, and serve screenshots as responsive AVIF/WebP.
