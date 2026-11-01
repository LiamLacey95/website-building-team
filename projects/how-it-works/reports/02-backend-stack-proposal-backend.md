# Report: how-it-works 02-backend-stack-proposal (Backend)

Date: 2026-11-01. State: DONE. Front-end sign-off on §1 and §4 is recorded as "OK with notes".

## Deliverable

`projects/how-it-works/api/stack-proposal.md`, built from `docs/api/_templates/stack-proposal.md`.

## Summary of the proposal

1. **Framework:** Astro 7.4.4, static output, no UI framework. Eleventy 3 and a Next.js 16 static export were considered and rejected: more glue in Eleventy's case, and a React runtime in Next's.
2. **Content pipeline:** I own it in `projects/how-it-works/server/content/`, with schemas and fixtures in `server/contracts/`. Front-end imports them in `web/src/content.config.ts`. It reads the repo itself:
   - the brief, research, api, gates, review and variants docs;
   - `.team/roles` and `.team/DECISIONS.md`;
   - concept PNGs with their sidecars, and screenshot manifests;
   - `git log`.

   How it handles them:
   - **Slots:** a missing artefact renders "This happens at Gate N" and never fails the build. `STRICT_SLOTS=1` on the release build turns any pending slot into an error.
   - **Excerpts:** quoted by heading or by `<!-- excerpt:id -->` marker. A vanished marker fails the build.
   - **Redaction and licence:** machine paths, thread ids and emails are redacted, with a post-build scan of `dist/`. A licence guard refuses images whose sidecar doesn't show WEB1 to WEB5 or WEB6b, and `research/refs/` is never read.
   - **Images:** AVIF and WebP through `<Picture>`, about 40 MB estimated, with a CI size budget of 150 MB.
   - **Other outputs:** `llms.txt`, `story.md`, the sitemap and JSON-LD.
   - **Tests:** unit tests with `node:test`.
3. **Hosting:** GitHub Pages via a custom Actions workflow.
   - It checks out with `fetch-depth: 0`, builds, checks links and the base path, runs the redaction and size checks, then deploys with `upload-pages-artifact` and `deploy-pages@v4`.
   - Paths use `base: /website-building-team`, and Astro emits the CSP as a meta tag.
   - Deploys go through the `github-pages` environment with the human as required reviewer, so **Gate 4 is enforced by GitHub**.
   - There are no official PR previews: the `deploy-pages` `preview` input is alpha and not public. Every push builds, runs the checks, and keeps `dist/` as a downloadable artifact.
4. **Interactivity:** one shared vanilla TS module (copy button, motion toggle, width switcher) plus a small inline head snippet that applies the motion preference before the page renders. Hard cap of 10 KB gzipped; scroll effects are CSS-only. CSP component rules: no inline handlers, no `style=`, no `define:vars`.
5. **Analytics:** none at launch. GoatCounter is free and cookieless if Q9 changes; Plausible is US$9/month.
6. **Cost:** $0, plus an optional domain.

## Answer to Gate 1 Q2 (Pages on a private repo)

- GitHub Free publishes Pages only from public repos.
- GitHub Pro and Team list Pages for private repos, but the site is still public. Only Enterprise Cloud can restrict access to it.
- Team is US$4 per user per month and needs an organization. Pro's price isn't on GitHub's current pricing page; it has historically been about US$4/month, but that's unconfirmed.
- Recommendation unchanged (Q2 A): make the repo public at Gate 4, which costs $0. Before that, act on Q10 and run Review's personal-data scan.

## Sources

The pages I relied on are linked inline in the proposal:
- **Package versions:** from the npm registry.
- **GitHub facts:** GitHub Docs (plans, Pages limits, Pages visibility), github.com/pricing and the `actions/deploy-pages` README.
- **Astro:** the Content Loader API reference and the deploy guide. CSP status comes from Report URI's Astro guide and Astro's experimental-flag page; I should confirm it against the Astro 7 configuration reference during the spike.
- **Analytics:** goatcounter.com and plausible.io.

## Commitments made to Front-end

- Publish `api/contract.md` plus fixtures for **both filled and pending** slot states **before Gate 3 work starts**.
- Run the Phase 4 spike with Front-end:
  - images from outside `web/` through `astro:assets` (with the prebuild-copy fallback);
  - `<Picture>` plus the JS module under the real meta CSP, with zero violations.

## Open items

- **GitHub Pro's price is unconfirmed.** It only matters if the human picks Q2 B.
- **Astro 7's `security.csp`:** I'll confirm its exact config location in the spike.

## Needs

Nothing.
