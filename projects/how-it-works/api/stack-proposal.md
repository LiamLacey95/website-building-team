# Stack proposal: how-it-works

Owner: Backend (with Front-end). Phase: 2 Define. Feeds: **Gate 1** (answers `research/define/gate1-questions.md` Q2 and Q9 on the technical side).
Date: 2026-11-01. Brief: `briefs/02-backend-stack-proposal.md`. Site type (see `docs/api/stack-playbook.md`): **1 Brochure / 3 Content**: a static story site with no runtime backend.

Front-end sign-off on §1 (framework) and §4 (interactivity): **pending**, see the end of this file.

## Requirements that drive the stack

| Requirement (source) | Implication |
|---|---|
| Show real artefacts from this repo, not mock-ups (BRIEF, `SUMMARY.md` insight 1) | A **build-time content pipeline** that reads `projects/how-it-works/`, `.team/` and `git log`, never a CMS |
| Later gates' artefacts don't exist yet (story outline, constraint 1) | **Slots**: a missing artefact renders "This happens at Gate N", the build never fails for it, and the slot fills automatically once the files exist |
| Excerpts must stay true to their source (constraint 4) | Quote by **marker or heading** from the real file; the build fails if a marker disappears |
| Chapter 8 is the git log (constraint 2) | CI checks out **full history** (`fetch-depth: 0`) |
| Concept PNGs and contact sheets (constraint 3) | **AVIF/WebP at responsive widths** at build time; masters stay in the repo, outside `dist/` |
| No runtime fetching; at most two small JS islands (constraint 5) | **Static HTML**, no framework runtime, vanilla JS islands |
| `llms.txt` and a markdown twin (constraint 6) | Generated from the same content by build endpoints |
| GitHub Pages project site under `/website-building-team/` (constraint 7) | `base` path everywhere; a link check in CI |
| WCAG 2.2 AA, reduced motion, no cookie banner (`constraints.md`) | CSS-first motion under `@supports` and `prefers-reduced-motion`; nothing stored except a user-requested motion preference |
| Performance budget: LCP < 2.5 s, CLS < 0.1, JS < 150 KB | No client framework; images sized and lazy; fonts self-hosted |
| Licences: only commercially licensed generated images ship; no third-party screenshots (`constraints.md`) | The pipeline **refuses** images whose sidecar shows a non-commercial workflow, and never reads `research/refs/` |
| Publishing needs the human's approval (BRIEF: Gate 1 plan, Gate 4 go-live) | The deploy job waits behind a **GitHub environment approval**, so Gate 4 is enforced by the tooling |

## 1. Framework and build

### Option A: Astro 7, static output (recommended)

- **Framework:** `astro` 7.4.4 (npm, 2026-11-01), `output: 'static'`, no UI framework integration. Components are `.astro` files, so they ship zero JS unless a `<script>` is added.
- **Content:** Astro content collections with **custom loaders** from the Content Loader API. The built-in `glob()` loader reads Markdown, JSON and YAML from any folder on disk, including outside `web/` ([Astro Content Loader API](https://docs.astro.build/en/reference/content-loader-reference/)). A custom loader handles the git log and slots (§2).
- **Images:** `astro:assets` `<Picture formats={['avif','webp']} widths=[…]>`, which uses sharp at build time.
- **CSP:** Astro's built-in CSP (`security.csp`, stable since Astro 6 per [Report URI's Astro guide](https://docs.report-uri.com/frameworks/astro/); it began as [an experimental flag in 5.9](https://docs.astro.build/en/reference/experimental-flags/csp)). It hashes Astro's own inline scripts and styles and emits a `<meta http-equiv="Content-Security-Policy">`, which is the only option on Pages. **Limit:** `<ClientRouter />` view transitions are incompatible with it, so we use cross-document `@view-transition` in CSS if we want transitions at all.
- **Why:** it is the playbook default for content sites. It already does everything the outline needs: content from files, image pipeline, static HTML, zero JS by default, base-path support and a documented Pages deploy. Research's evidence points to exactly this shape.

### Option B: Eleventy 3 + a sharp script

`@11ty/eleventy` 3.1.7. Very light and fully static. But we would hand-build the image pipeline (eleventy-img), CSP hashing and typed content schemas. It's more glue for the same result.

### Option C: Next.js 16 static export

`next` 16.4.3 with `output: 'export'`. It ships the React runtime (well over our two-island budget), its images can't be optimised in a static export without extra tooling, and its server features would go unused. It's the wrong tool for a static story.

**Decision: A.** `web/` is an Astro project; `server/` holds the content pipeline that `web/` imports (§2). Node 24 LTS (as installed), npm with a committed lockfile.

## 2. Content pipeline

### Where the code lives

| Path | Owner | What |
|---|---|---|
| `projects/how-it-works/server/content/` | Backend | Loaders, slot registry, excerpt extraction, git log reader, redaction, licence guard (plain TypeScript, imported by `web/`) |
| `projects/how-it-works/server/contracts/` | Backend | Types and Zod schemas for every collection: the contract Front-end builds against (published in `api/contract.md` before Gate 3) |
| `projects/how-it-works/server/contracts/fixtures/` | Backend | Realistic fixtures for slots that are still empty, so Gate 3 variations can show filled *and* pending states |
| `projects/how-it-works/web/src/content.config.ts` | Front-end | Imports the loaders and schemas; pages and components render them |

### How sources become content

| Source (repo paths) | Collection | Loader |
|---|---|---|
| `projects/how-it-works/BRIEF.md`, `research/**/*.md` (not `refs/`), `api/*.md`, `gates/*/README.md`, `gates/*/review.md`, `review/*.md`, `variants/*.md`, `.team/roles/*.md` | `docs` | `glob()` with the repo root as `base` |
| `.team/DECISIONS.md` | `decisions` | Custom: parses the table and filters `Project = how-it-works` or `kit` |
| `concepts/*/**/*.png` plus the `.json` sidecar next to each | `images` | Custom: pairs image and sidecar; applies the licence guard (below) |
| `screenshots/**/manifest.json` (written by `tools/screenshot.mjs`) | `screenshots` | Custom: reads the manifests and resolves each PNG |
| `git log --format=%H%x09%aI%x09%s` | `commits` | Custom: runs git at build time, parses `<role>: <what>`, computes per-role counts and phase timestamps |
| `server/content/slots.ts` (the registry) | `slots` | Custom: resolves each slot to `filled` or `pending` |

### Slots

The registry lists every artefact the story and `/made/` expect:

```ts
{ id: 'g2-style-tiles', chapter: 5, gate: 'G2', sources: ['projects/how-it-works/concepts/*/style-tile.png'], min: 3 }
```

At build time each slot resolves to:
- `{ status: 'filled', items }`, or
- `{ status: 'pending', gate: 'G2', label: 'This happens at Gate 2' }`.

Components switch on `status`, so a missing slot never breaks the build and is never filled with lorem ipsum. The slot fills on the next build after the files land.

For the release build, `STRICT_SLOTS=1` turns any pending slot into a build error. This makes "every slot is filled" a technical check before Gate 4. The `/made/` "Messages" slot is only registered if Q5 is approved.

### Excerpts

A doc can be quoted in two ways:
- **By heading:** `excerpt: { file: 'research/SUMMARY.md', heading: 'Three insights that should shape the design' }`.
- **By marker:** wrap a passage in `<!-- excerpt:hero-claim -->` … `<!-- /excerpt -->` in the source file and quote it by that marker.

The text is extracted verbatim and rendered with a "from `<path>` at `<short sha>`" caption linking to the file on GitHub. If the file exists but the heading or marker is gone, the build **fails**, so the site cannot silently drift from the repo. If the file doesn't exist yet, that is a slot (pending), not an error.

### Redaction (Q5 "curated")

Every string from a source passes through a redaction step before it reaches HTML:
- machine paths (`[A-Z]:\…`, `/home/…`, `/Users/…`) become `<repo>/…`;
- T3 thread and environment ids are removed;
- email addresses are removed.

A **post-build scan** of `dist/` fails CI if any of those patterns remain. It covers anything the redaction step missed.

### Licence guard

An image is published only if its sidecar names a workflow on an allow-list. The allow-list holds the commercially licensed workflows: WEB1 to WEB5 and WEB6b. Anything else fails the build with the file name and a pointer to `artgen/README.md`. Examples:
- **WEB6:** the 4x-UltraSharp upscaler is CC BY-NC-SA, so it is for concept boards only.
- **Missing sidecar:** an image with no sidecar has no recorded provenance, so it is refused.

The same check runs over `web/public/assets/generated/`. `research/refs/` is never read.

### Images

- PNG masters stay where they are.
- At build, `<Picture>` emits AVIF and WebP at about 4 widths (for example 480, 960, 1440, 1920; the final set comes from Front-end's layout), with explicit `width`/`height` to keep CLS at 0. Images below the fold use `loading="lazy"`.
- Contact sheets are rebuilt from the individual screenshots at each width rather than shipped as one huge PNG.
- **Size estimate:** about 60 images × 4 widths × 2 formats × ~80 KB ≈ **40 MB**, against Pages' 1 GB limit. A CI check fails the build if `dist/` exceeds **150 MB** (the budget, not the platform limit).
- **To verify first in Phase 4:** Vite only reads files outside the project root if `server.fs.allow` includes the repo root (set in `astro.config`). If `astro:assets` refuses assets outside `web/`, the fallback is a 30-line prebuild step that copies the selected masters into a git-ignored `web/src/assets/artefacts/`. The rest of the design is unchanged.

### Second outputs

- `src/pages/llms.txt.ts` and `src/pages/story.md.ts` are build endpoints. They render the same collections as plain text and Markdown.
- `sitemap-index.xml` comes from `@astrojs/sitemap`, plus `robots.txt`.
- JSON-LD `SoftwareSourceCode` in the head ([schema.org](https://schema.org/SoftwareSourceCode)).

### Tests

The pipeline gets unit tests with `node:test` (no extra dependency). They cover slot resolution, excerpt extraction (heading, marker, missing marker), commit parsing, redaction patterns and the licence guard. Fixtures live in `server/content/__fixtures__/`. CI runs them before the build.

## 3. Hosting and deploy

### GitHub Pages from this repo via GitHub Actions (recommended)

- **URL:** `https://liamlacey95.github.io/website-building-team/`, with `site: 'https://liamlacey95.github.io'` and `base: '/website-building-team'` in `astro.config`. Every link and asset goes through `import.meta.env.BASE_URL`, and a CI link check on `dist/` catches misses.
  - A custom domain later means setting `site` to the domain, removing `base` and adding a `CNAME` ([Astro deploy guide](https://docs.astro.build/en/guides/deploy/github/)).
- **Workflow:** `.github/workflows/how-it-works.yml`, which I'll write in Phase 5. Its steps:
  1. `actions/checkout` with `fetch-depth: 0` (full history for the git log).
  2. `actions/setup-node` with Node 24 and an npm cache.
  3. `npm ci`, pipeline tests, `astro build` (with `STRICT_SLOTS=1` on the release run).
  4. Checks on `dist/`: link and base path, redaction scan, size budget.
  5. `actions/upload-pages-artifact`, then `actions/deploy-pages@v4` with permissions `pages: write`, `id-token: write` ([deploy-pages README](https://github.com/actions/deploy-pages)).

  Action versions get pinned when I write the workflow.
- **CSP (meta tag, emitted by Astro):** `default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' <hashes>; script-src 'self' <hashes>; base-uri 'self'; form-action 'none'; object-src 'none'`.
  - A meta tag can't set `frame-ancestors` or reporting ([GitHub community discussion](https://github.com/orgs/community/discussions/54257)), so we accept that limit.
  - Analytics, if chosen, add one origin (§5).
- **Limits** ([GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)): published site ≤ 1 GB, soft bandwidth 100 GB/month, deploys time out after 10 minutes, and the 10 builds/hour limit doesn't apply to custom Actions workflows. We're well inside all of them.
- **Gate 4 enforced:** the deploy job uses the `github-pages` environment with a **required reviewer (the human)**. CI can build and check every push, but nothing goes live until the human approves the deployment.

### Preview builds

**No official per-branch Pages previews.** `actions/deploy-pages` has a `preview` input, but its README says it is *"only in alpha currently and is not available to the public"* ([deploy-pages](https://github.com/actions/deploy-pages)).

Third-party actions such as `rossjrw/pr-preview-action` need branch-based (`gh-pages`) publishing, which conflicts with Actions-based deploys and would publish unreviewed work publicly. **Not recommended.**

Instead:
- Every push and pull request **builds and checks** the site, and uploads `dist/` as a downloadable workflow artifact.
- Gate 3 variants are reviewed locally anyway (`node tools/variants.mjs dev all`) and screenshotted into the gate packet.

### What makes it public: the private-repo question (Q2)

**Facts:**
- GitHub Free publishes Pages **only from public repositories**. GitHub's plans page lists Pages under "Advanced tools and insights in private repositories" for **GitHub Pro** and **GitHub Team** ([GitHub's plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans); [pricing](https://github.com/pricing) shows Free "Public repositories", Team "Included").
- A site published from a private repo is still visible to anyone on the internet. Only **GitHub Enterprise Cloud** organizations can restrict a site to people with repo access ([Pages visibility](https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site)).
- **Prices:**
  - Team is **US$4 per user per month** ([pricing](https://github.com/pricing)) and needs an **organization**, so the repo would move from `LiamLacey95` to an org.
  - **GitHub Pro (personal) isn't priced on the current pricing page.** It has historically been about US$4/month, but I couldn't confirm that, so check it before choosing.
- Actions minutes: unlimited on public repos; private repos draw on the plan's monthly allowance. Our builds are a few minutes each, well within any plan.

**What that means for the human's options:**

| Option (Q2) | Cost | Notes |
|---|---|---|
| **A. Make the repo public at Gate 4; Pages on GitHub Free** (recommended) | **$0** | The kit is meant to be cloned, so it goes public anyway. Until G4 the repo stays private: CI builds and checks; the deploy waits for approval. Before going public, act on Q10 (remove `research/refs/`) and run Review's secret and personal-data scan (brief 04). |
| B. Keep the repo private; buy Pro (personal) or Team (org, $4/user/month) | Pro: unconfirmed, about $4/month; Team: $4/user/month plus moving to an org | The site is public but the code isn't, which contradicts "anyone can clone it". Only worth it if the kit must stay private. |
| C. Another static host from the private repo (Cloudflare Pages, Netlify) | $0 on free tiers (`docs/api/stack-playbook.md`) | Another account to own; headers become possible (a real CSP header and `frame-ancestors`). Nothing in the stack changes except the deploy step. |

## 4. Interactivity budget

No client framework. Everything below is vanilla TypeScript in Astro `<script>` tags, which Astro bundles as small modules. **The whole site's JS is expected under 10 KB gzipped against the 150 KB budget.** All of it is progressive enhancement: with JS off, every story, artefact and link still works.

| Feature | Where | JS (gzipped, est.) | Without JS |
|---|---|---|---|
| Copy button for the setup sentence | Hero, chapter 9, `/setup/` | ~1 KB (`navigator.clipboard`, `aria-live` "Copied") | Selectable `<code>` block with "Select and copy" |
| Reduce-motion toggle | Header, every page | ~1 KB: sets `data-motion="off"` on `<html>`. Persisted in `localStorage` because the visitor asked for it (strictly necessary, so no banner; named in the privacy note). An inline head snippet (CSP-hashed) applies it before first paint, so there's no flash | Hidden; CSS still honours the OS setting |
| Contact-sheet width switcher | Chapter 6, `/made/` | ~1 KB: buttons, not swipe (WCAG 2.5.7) | All widths shown stacked |
| Scroll-driven effects (diamond draw, artefacts sliding in, prompt token) | Home story | **0 KB.** Pure CSS inside `@supports (animation-timeline: view())`, `@media (prefers-reduced-motion: no-preference)` and `:root:not([data-motion="off"])` | Static story; content is never hidden at `opacity: 0` by default |
| Chapter nav and progress rail | Home | 0 KB: anchor links; current chapter by CSS scroll-driven state where supported | Plain links |

Explicitly out: animation libraries, WebGL or canvas on first load, scroll-jacking, client-side data fetching, `<ClientRouter />`.

## 5. Analytics (Q9)

| Option | Cost | Cookies | CSP impact | Notes |
|---|---|---|---|---|
| **None at launch** (recommended, matches Q9 A) | $0 | none | none | Use GitHub's own traffic insights (views, clones, stars) once public |
| GoatCounter (hosted) | $0: "free for reasonable public usage"; small businesses are fine, millions of pageviews a day are not ([goatcounter.com](https://www.goatcounter.com/)) | "Identify unique visits without cookies or persistently storing any personal data" ([GDPR help](https://www.goatcounter.com/help/gdpr)) | Add its script and endpoint origins to `script-src`/`connect-src` | Can count copy-button clicks as an event. Donation-supported |
| Plausible (hosted) | US$9/month Starter, 10k pageviews/month, 30-day trial, no free tier ([plausible.io](https://plausible.io/#pricing)) | none | Same as above | Polished dashboards; recurring cost |

If Q9 becomes B, I recommend GoatCounter. Either way the privacy note must mention GitHub's own IP logging ([About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)).

## Comparison of the framework options

| | A. Astro 7 | B. Eleventy 3 | C. Next.js 16 export |
|---|---|---|---|
| Monthly running cost | $0 on Pages | $0 | $0 |
| Setup effort | Low: content loaders, images and CSP are built in | Medium: image pipeline and CSP glue | Medium-high: image export and a React runtime to avoid |
| Client JS baseline | 0 KB | 0 KB | ~90 KB+ React runtime *(inferred)* |
| Fit with "artefacts from files" | Content collections plus custom loaders | Data cascade, untyped | File reads in server components at build |
| Lock-in | Low: output is plain HTML/CSS | Low | Medium |
| What the client maintains | Nothing at runtime; a rebuild on push | Same | Same |

## Cost breakdown (recommended option)

| Item | Plan | $/month | Source |
|---|---|---|---|
| Hosting | GitHub Pages, public repo, GitHub Free | 0 | [GitHub's plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans) |
| CI | GitHub Actions, public repo | 0 | same |
| CMS | none: content is the repo | 0 | n/a |
| Analytics | none (or GoatCounter, free) | 0 | [goatcounter.com](https://www.goatcounter.com/) |
| Fonts | self-hosted OFL | 0 | `constraints.md` |
| Domain (optional) | e.g. a `.dev` | about US$10 to 20/year *(not checked)* | registrar |
| **Total** | | **$0** (plus an optional domain) | |

## Accounts and secrets needed

| Account | Owner | Env var(s) | Scope |
|---|---|---|---|
| GitHub repo `LiamLacey95/website-building-team` | the human | none: Pages uses the workflow's OIDC token | Workflow permissions `contents: read`, `pages: write`, `id-token: write` only |
| `github-pages` environment reviewer | the human | n/a | Approves each production deploy (Gate 4) |
| GoatCounter (only if Q9 = B) | the human | none (the site code is public) | n/a |

No secrets are stored in the repo or in Actions for the recommended option.

## What the human maintains after launch

- Approve deploys in GitHub (the `github-pages` environment).
- Keep the repo public (or choose B or C above).
- Optional: domain renewal, and the analytics account if chosen.
- Nothing runs at request time, so there is nothing to patch, back up or pay for monthly.

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| `astro:assets` won't optimise images that live outside `web/` | Medium | Spike at the start of Phase 4; fallback prebuild copy step (§2). No change to the contract |
| A quoted heading or marker is edited away | Medium | The build fails loudly with the file and marker name; fix the marker or the reference |
| Personal data or machine paths leak through artefacts | Medium | Redaction plus a post-build scan that fails CI; Review's kit audit before going public |
| A non-commercial image slips into the site | Low | Licence guard on sidecars fails the build; `generate.py` already refuses WEB6 output into `web/` |
| A shallow checkout gives an empty receipt chapter | Low | `fetch-depth: 0`; the loader detects a shallow repo and fails the release build rather than showing a wrong count |
| Astro CSP blocks something Front-end adds (an inline handler, a third-party script) | Low | Inline handlers are banned in the component rules; Review checks the CSP in the G4 audit |
| Repo stays private and the human doesn't want Pro or Team | Low | Option C (Cloudflare Pages or Netlify) swaps one deploy step |
| Variants can't be previewed on Pages | Certain | Local preview via `tools/variants.mjs` plus downloadable CI artifacts, which is how Gate 3 already works |

## Recommendation

Build the site as a **static Astro 7 project** whose content comes from a **build-time pipeline over the repo itself**. The pipeline has slots for future gates, verbatim excerpts by marker, redaction, and a licence guard on images. Ship **under 10 KB of vanilla JS** with CSS-only scroll effects.

Deploy to **GitHub Pages via Actions**. Every push builds and checks the site. Go-live is gated by a human-approved `github-pages` environment, and the repo becomes public at Gate 4. **Running cost is $0.**

The main risk is image handling for files outside `web/`, with a known small fallback.

## Answers for Gate 1

- **Q2 (hosting):** A is technically sound and costs $0. B means Pro (price unconfirmed, historically about $4/month) or Team ($4/user/month in an org), and the site is public either way. C works from the private repo.
- **Q9 (analytics):** none at launch. If counting copies matters later, GoatCounter is free and cookieless.

## Front-end sign-off

| Item | Status |
|---|---|
| §1 Framework and build | pending |
| §4 Interactivity budget | pending |
