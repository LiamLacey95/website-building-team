# Stack proposal: how-it-works

Owner: Backend (with Front-end). Version 2, after Gate 1. Brief: `briefs/05-backend-contract-vercel.md`.
Date: 2026-11-01. Site type (`docs/api/stack-playbook.md`): **1 Brochure / 3 Content**: a static story site with no runtime backend.

**Gate 1 decided** (`gates/G1-strategy/DECISION.md`), and those decisions override version 1 of this file, which Review passed and the human saw in the Gate 1 packet. Version 1 is in git history (`d5fea90`).

Front-end signed off §1 and §4 of version 1 ("OK with notes"). The Gate 1 changes to those sections are being agreed with Front-end through the contract (`api/contract.md`), and the sign-off table at the end records the state.

## Gate 1 changes

| Decision | What changed in the stack |
|---|---|
| **Q2 C: Vercel** | **Hosting is Vercel at the site root**, not GitHub Pages. That means:<br>- no base path;<br>- a real `Content-Security-Policy` **header** from `vercel.json` instead of a meta tag;<br>- private preview deployments per branch.<br>The repo doesn't have to be public. Going live needs the human's Vercel account at Gate 4 (§3). |
| **Q3 A as a creative showcase** | **Creativity, interest and polish are the measure.**<br>- The 10 KB JavaScript cap is gone. The playbook budget (JS under 150 KB gzipped on content pages, LCP under 2.5 s, CLS under 0.1) stays as the ceiling, and a set piece may spend most of it.<br>- Accessibility and reduced motion still apply (§4). |
| **Q5: quotes made up** | **The verbatim-excerpt pipeline is removed:** no heading or marker extraction, no "from `<path>` at `<sha>`" captions.<br>- Dialogue, agent messages and gate decisions are authored content (`server/content/`), written for the story.<br>- File views on the site show real paths with lines written for the story.<br>- Real imagery and screenshots still come from the repo through slots. |
| **Q6: no time or cost** | Nothing on the site shows a timing, duration, cost or token figure.<br>- The "receipt" chapter becomes **The paper trail**: counts of commits by role, briefs, reports, images and gates, with no dates.<br>- A test fails if authored copy contains a time or cost figure. |
| **Q7 D: NVIDIA GPU required** | The site and setup copy say so plainly (`site.gpuNotice`, the FAQ). |
| **Q9: no analytics** | No analytics, no cookies, no banner. The CSP allows no third-party origin at all. |
| **Q10 C: history rewrite at G4** | The real git log stays. Vercel builds clone only 10 commits, so counts come from a **committed snapshot** (§2), not a live `git log` in CI. The version 1 snapshot plan for a squashed public repo isn't needed. |
| **Q11 A: Klein may ship** | `server/content/licence-policy.json` says `"klein": "allowed"`. The licence guard still walks every image's whole provenance chain and still refuses anything non-commercial. |

**Kept from version 1:** Astro 7 static, the licence guard, redaction with a post-build scan, the image pipeline (AVIF and WebP), slots for later gates, `llms.txt` and `story.md`, and the component rules for a strict CSP.

## Requirements that drive the stack

| Requirement (source) | Implication |
|---|---|
| A highly creative, polished showcase (G1 Q3) | Static HTML plus whatever client code a set piece earns, self-hosted and bundled. No CDN, so the CSP stays `'self'` |
| The story is written, not mined (G1 Q5) | Authored content collections in `server/content/`, validated by Zod schemas in `server/contracts/` |
| Real imagery from later gates (Concept art, the G3 contact sheet, Review's audit) | **Slots:** pending until the files exist ("This happens at Gate N"), filled automatically, and strict at release |
| Setup facts must match the kit (requirements, the `--check` output) | Read from `BOOTSTRAP.md` at build time when available; a committed snapshot otherwise, with a drift test |
| Vercel isolates the Root Directory and clones 10 commits | Root Directory is `projects/how-it-works`; kit facts and counts come from committed snapshots |
| WCAG 2.2 AA, reduced motion, no cookie banner | Motion only under `prefers-reduced-motion: no-preference` and the motion toggle; nothing stored except the motion preference |
| Only commercially licensed generated images ship | The licence guard walks every sidecar's chain; the build fails otherwise |
| Going live needs the human's approval (G4) | Vercel Deployment Protection stays on "All deployments" until Gate 4 (§3) |

## 1. Framework and build

**Astro 7.4.4, `output: 'static'`, no adapter** (a static Astro site needs none on Vercel: "Your Astro project is a static site by default. You don't need any extra configuration to deploy a static Astro site to Vercel", [Astro docs](https://docs.astro.build/en/guides/deploy/vercel/)).

No UI framework by default. Front-end may add a small library for a set piece (canvas, WebGL) if it earns its place. It must be bundled, not loaded from a CDN, with a static or reduced-motion fallback.

Alternatives considered in version 1 (Eleventy 3, a Next.js 16 static export) are still worse fits. The Vercel move favours neither.

**Required `astro.config` settings**, all proven in a local build (§5):

```js
export default defineConfig({
  site: 'https://<production domain>',      // set at Gate 4
  trailingSlash: 'always',                   // matches vercel.json "trailingSlash": true
  build: { inlineStylesheets: 'never' },     // no <style> blocks: style-src 'self'
  vite: {
    resolve: { dedupe: ['zod'] },            // server/contracts uses Astro's copy of zod
    server: { fs: { allow: ['..'] } },       // dev server may read ../server
    build: { assetsInlineLimit: 0 },         // no inline <script>: script-src 'self'
  },
});
```

**Component rules (Review checks them; `server/scripts/check-dist.ts` enforces the first three on every build):**
- no inline `<script>`; any script that must run before paint, such as the motion preference, is a small file in `public/` loaded with `<script src>`;
- no `<style>` blocks and no `style="…"` attributes;
- no `define:vars` and no inline event handlers;
- no CDN or third-party origin.

**Why a header and not Astro's `security.csp` meta tag.** Browsers enforce every CSP that applies, so a header and a meta tag both apply. A static header can't carry Astro's per-page hashes, so any `script-src` or `style-src` in the header would block inline code that the meta tag allows by hash. We use the strict header and no inline code. That is stronger (no hash bookkeeping), and Front-end's `web/` follows it (2c74ad3). `check-dist.ts` evaluates the header and any per-page meta together, exactly as a browser would, so a later switch to meta hashes would be caught at build time rather than in production.

## 2. Content and data

The full contract is in `api/contract.md`. In short:

| Collection | Source | Loader |
|---|---|---|
| `site`, `roles`, `gates`, `scenes`, `setup`, `credits` | `server/content/*.json`, authored (G1 Q5) | Astro `file()` |
| `chapters` | `server/content/chapters/*.md`, authored; frontmatter plus narrative | Astro `glob()` |
| `requirements` | `BOOTSTRAP.md` §1 when the kit is checked out; else `server/content/generated/requirements.json` | `requirementsLoader()` |
| `slots` | `server/content/slots.json` registry → real files in `concepts/`, `screenshots/`, `review/`, `gates/` | `slotsLoader()` |
| `numbers` | `git log` and file counts when the full kit is available; else `server/content/generated/numbers.json` | `numbersLoader()` |

**Snapshots.**
- `node server/scripts/sync-kit-facts.ts` refreshes both snapshots from the full checkout.
- A test fails if the requirements snapshot drifts from `BOOTSTRAP.md`.
- The numbers snapshot is refreshed before Gate 4 and after the Q10 history rewrite, because counts move with every commit.

**Slots.**
- Unchanged from version 1, except that image paths are resolved for Astro's `image()` helper, so `<Picture>` optimises files that live outside `web/`.
- `CONTENT_SLOTS=filled|pending` forces a state for the Gate 3 variations: "filled" uses our own kit smoke-test renders and dry-run screenshots, which are stand-ins and say so in their captions.
- `STRICT_SLOTS=1` fails the release build if any slot is still pending.

**Licence guard (kept).**
- Every generated image's sidecar is walked in full, including nested `source_provenance` and provenance stored as a JSON string.
- An image fails on a workflow outside WEB1 to WEB5 and WEB6b, on a non-commercial model or licence anywhere in the chain, or on a missing sidecar.
- FLUX Klein follows `licence-policy.json`, now `allowed` (Q11 A).
- Review's `docs/review/tools/licences.mjs` stays the independent check.

**Redaction (kept).**
- One pattern list (`server/content/redact.ts`) covers drive paths with either slash, Git Bash and POSIX home paths, UNC paths, T3 thread ids, UUIDs and emails. The repo root is replaced first, which handles the space in this repo's folder name.
- It is used to clean the captured `--check` output, and by the post-build scan of `dist/`.

**Removed (Q5, Q6, Q10):**
- excerpt markers and verbatim quotes;
- source captions with commit hashes;
- dates and durations in the paper trail;
- the squashed-repo git-log snapshot plan.

**Second outputs (kept, Front-end builds them from the same collections):** `llms.txt`, `story.md`, `sitemap-index.xml` (`@astrojs/sitemap`), `robots.txt`, and JSON-LD `SoftwareSourceCode`.

## 3. Hosting and deploy: Vercel

**Project layout on Vercel:**
- **Root Directory: `projects/how-it-works`.** Vercel isolates the Root Directory: "Your app will not be able to access files outside of that directory. You also cannot use `..` to move up a level" ([Configure a build](https://vercel.com/docs/builds/configure-a-build)). `web/` imports `../server`, so the root has to be the project folder, not `web/`. Kit files above it (`BOOTSTRAP.md`, `.team/`) are covered by the snapshots.
- **`projects/how-it-works/vercel.json`** (Backend), which sets:
  - `framework: null`;
  - install `npm ci --prefix web`;
  - build `npm run build --prefix web && node server/scripts/check-dist.ts web/dist`;
  - output `web/dist`;
  - `trailingSlash: true`;
  - headers (below).

  The post-build check runs inside the Vercel build, so a page with an inline script, a leaked path or an over-budget `dist/` never deploys.
- **Node:** 22.x (22.18 or later) or 24.x in Project Settings. The check script is TypeScript run directly by Node.
- **Git history:** Vercel clones with `--depth=10` (same page). Nothing in the build needs more, because counts come from the snapshot.

**Headers (all routes):**

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), browsing-topics=()` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Frame-Options` | `DENY` (older browsers; `frame-ancestors` covers modern ones) |
| `Cache-Control` on `/_astro/*` | `public, max-age=31536000, immutable` (hashed file names) |

As a header, the CSP can set `frame-ancestors`, which the version 1 meta tag couldn't. Vercel's preview toolbar injects its own script on previews and the CSP will block it. That's acceptable, and the production site doesn't use the toolbar.

**Previews per branch.**
- Every push to a branch other than the production branch (`master`) gets a preview deployment, with URLs `<project>-git-<branch>-<scope>.vercel.app` and a per-commit URL ([Generated URLs](https://vercel.com/docs/deployments/generated-urls)).
- This suits **Gate 3**: each variant branch (`variant/how-it-works-g3-a-…`) gets its own preview link the human can open on a phone, in addition to the contact sheet.
- It only works once the Vercel project exists. Previews stay private under Deployment Protection (below). The local workflow (`tools/variants.mjs`) remains the default if the human doesn't want to create the project before Gate 4.

**Plan.**
- Hobby is free but "restricted to non-commercial personal use only". Commercial use is anything "used for the purpose of financial gain of anyone involved in any part of the production of the project" ([Fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)).
- A personal showcase of a free, open-source kit with no ads or sales fits Hobby *(inferred; the human decides)*.
- If the site will market paid services, Pro is US$20 per deploying seat per month ([Pro plan](https://vercel.com/docs/plans/pro-plan)).
- Hobby can deploy from a private repo on a personal GitHub account; the restriction applies to repos owned by GitHub organizations ([Vercel Git docs](https://vercel.com/docs/git)) *(inferred from that wording)*.

**Gate 4 on Vercel.** Vercel has no required-reviewer step on Hobby, so the approval runs on **Deployment Protection**:
- "Standard Protection … protects all domains except production domains"; "All Deployments" secures preview and production alike ([Deployment Protection](https://vercel.com/docs/deployment-protection)).
- Hobby includes Vercel Authentication "for preview and production deployments" ([Hobby plan](https://vercel.com/docs/plans/hobby)).

The plan:
1. **Until Gate 4:** protection is set to **All Deployments**. Only the human, signed in, can see any deployment, production included.
2. **Gate 4 "ship it" =** the human switches protection to **Standard**. Production becomes public; previews stay private.

**What the human does (only at Gate 4, or at Gate 3 if they want variant previews). The team never logs in, links or deploys.**
1. **Vercel account:** Hobby, or Pro if the site is commercial.
2. **Do the Q10 history rewrite first** (PM, with all agents paused), then push. Vercel then never sees the old history.
3. **Create the project without deploying:** run `npx vercel link` in `projects/how-it-works`, or import in the dashboard. *The first deployment of a new project is always production* ([Environments](https://vercel.com/docs/deployments/environments)), so with the dashboard import, set protection right after the first deploy.
4. **Settings:**
   - Root Directory `projects/how-it-works`;
   - Framework "Other" (`vercel.json` overrides it);
   - Node 22.x or 24.x;
   - Deployment Protection "All Deployments" until go-live;
   - no environment variables are needed: there are no secrets.
5. **Connect Git:** grant the Vercel GitHub app access to `LiamLacey95/website-building-team`; the production branch is `master`.
6. **Go live:** switch protection to Standard. Optionally add a custom domain and set `site` in `astro.config`.
7. **After launch:** nothing runs at request time; there's nothing to patch, back up or pay for on Hobby.

## 4. Interactivity

- **The 10 KB cap is lifted** (G1 Q3). The playbook budget is the ceiling: JS under 150 KB gzipped on content pages, LCP under 2.5 s and CLS under 0.1 on mobile.
- **Must stay true:** every chapter works without JS and with reduced motion. Motion runs only under `prefers-reduced-motion: no-preference` and when the motion toggle is on. No scroll-jacking; drag has a button alternative (WCAG 2.5.7).
- **Still planned, from version 1:** copy button, motion toggle, contact-sheet width switcher, CSS scroll-driven effects under `@supports`, and optional CSS view transitions. The motion pre-paint snippet becomes an external `public/` script (CSP).
- **New option:** a canvas or WebGL set piece through a small bundled library, with a static fallback.
- **Front-end decides** at Gate 3, inside these limits.

## 5. Proof: local Vercel build (no account)

Run on 2026-11-01 against a copy of `projects/how-it-works` with no kit above it, which is how Vercel sees it. It used `npx vercel@65.9.0` and a hand-written, git-ignored `.vercel/project.json`; there was no login, no `vercel pull` and no link.

- `astro build` with the contract: all ten collections synced. The requirements and numbers loaders fell back to the snapshots, and every slot filled from the sample images (`CONTENT_SLOTS=filled`).
- `<Picture>` optimised images from `server/contracts/fixtures/` (outside `web/`) to AVIF and WebP. **This answers the version 1 Phase 4 question.**
- With the two settings in §1, the HTML had **no inline `<script>`, no `<style>`, no `style=`**. Without `assetsInlineLimit: 0`, Astro inlined the small module script, which the header CSP would block.
- `vercel build`: exit 0. The `.vercel/output/` Build Output API v3 had `config.json` and `static/`, and the generated routes carry every header above plus the trailing-slash redirects.
- `check-dist.ts` ran inside the Vercel build: clean. Tested against a deliberately broken page, it caught the inline script, the `<style>`, the `style=`, a drive path and an email.
- The build needed no `server/node_modules`: Zod resolved through Astro's copy (`dedupe`).

**Note for Front-end:** for a WebP source, `<Picture>`'s default PNG fallback came out larger than the source (up to about 1.1 MB). Set `fallbackFormat` (for example `webp` or `jpg`) per component.

## Cost

| Item | Plan | US$/month |
|---|---|---|
| Hosting | Vercel Hobby (non-commercial) | 0 |
| | Vercel Pro, only if the site is commercial | 20 per deploying seat |
| CMS, analytics, fonts | none, none, self-hosted OFL | 0 |
| Domain (optional) | any registrar | about 10 to 20 a year *(not checked)* |

## Accounts and secrets

| Account | Owner | Secrets | Notes |
|---|---|---|---|
| Vercel | the human | none | Created at Gate 4 (or Gate 3 for previews). The team never logs in |
| GitHub | the human | none | The Vercel GitHub app needs read access to the repo |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| The production site is public before Gate 4 (a new project's first deploy is production) | Medium if imported early | Create the project with `vercel link` (no deploy) or only at Gate 4. Set protection to All Deployments before connecting Git |
| A set piece needs a CDN or inline code that the CSP blocks | Medium | Bundle and self-host. `check-dist` and the header make this visible at build time, not in production |
| Snapshots go stale (requirements or counts) | Medium | The requirements drift test; refresh both before Gate 4 and after the Q10 rewrite |
| Hobby's non-commercial terms don't fit the human's use | Low | Pro at US$20/month; nothing else changes |
| Heavy client code hurts LCP on mobile | Medium | Playbook budget; Review's Lighthouse check at Gate 4; static fallback |
| A non-commercial image slips in | Low | The licence guard fails the build; `generate.py` refuses WEB6 output into `web/` |

## Recommendation

Static Astro 7 on Vercel at the site root, built from the `projects/how-it-works` folder:
- authored story content plus three computed collections, behind a published Zod contract;
- a header CSP that allows nothing outside the site, enforced by a post-build check that runs inside the Vercel build;
- the licence guard and redaction from version 1;
- Gate 4 enforced by Vercel Deployment Protection.

Running cost is US$0 on Hobby if the site stays non-commercial. Nothing here needs an account until the human creates one.

## Front-end sign-off

| Item | Version 1 | Version 2 (after Gate 1) |
|---|---|---|
| §1 Framework and build | OK with notes (2026-11-01) | **OK with notes (2026-11-01).** Front-end's notes on the contract are taken into contract 0.2.0 (`kicker` optional; image dimensions; `diamond` and `gate` stable). Its CSP note (a meta tag plus a slimmer header) was overtaken by its own commit 2c74ad3, which follows the strict header. `check-dist` passes on its scaffold's build. |
| §4 Interactivity | OK with notes (2026-11-01) | The 10 KB cap is lifted by Gate 1. Version 1 notes 5 to 7 still apply. No objection raised. |
