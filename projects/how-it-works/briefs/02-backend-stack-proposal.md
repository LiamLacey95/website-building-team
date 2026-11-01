# Brief 02-backend-stack-proposal (project: how-it-works)

Owner: Backend, with Front-end. Phase: 2 Define. Do this **after** your kit brief (03-backend-bootstrap) is done. Ends at Gate 1.

Read `projects/how-it-works/BRIEF.md`, `research/SUMMARY.md` and `research/constraints.md`. Research's draft sitemap and story outline will be in `research/define/` (they are being written in parallel; use them if present).

Deliverable: `projects/how-it-works/api/stack-proposal.md` from `docs/api/_templates/stack-proposal.md`, covering:
1. **Framework and build:** recommendation (Research's evidence points to a static, CSS-first site; Astro is the playbook default) and the alternatives you considered.
2. **Content pipeline:** the site shows real artefacts from this repo (briefs, research, concept images and sidecars, variant screenshots, gate packets, review verdicts, git log). Propose how the build reads them from `projects/how-it-works/` and the repo at build time, so Phase 5 fills the "slots" automatically and the site stays true to the repo. Note what must be copied or optimised (images to AVIF or WebP at sizes).
3. **Hosting and deploy:** GitHub Pages from this repo via GitHub Actions: base path, CSP via meta tag, size limits, preview builds for branches if possible, and what makes it public (the repo is private now; Pages on a private repo needs a paid plan, so say what that means for the human's options).
4. **Interactivity budget:** copy button, reduced-motion toggle, CSS scroll-driven effects under `@supports`: how much JS, and where.
5. **Analytics:** none, or a named cookieless option, with cost.
6. **Risks and cost** (expected £/$0 if on Pages).

Agree items 1 and 4 with Front-end before you finish (you may message the Front-end thread directly), and record Front-end's sign-off in the proposal.
When done: commit with a pathspec, write `projects/how-it-works/reports/02-backend-stack-proposal-backend.md`, send DONE to the PM, then wait.
