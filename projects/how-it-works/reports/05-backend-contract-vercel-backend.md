# Report: how-it-works 05-backend-contract-vercel (Backend)

Date: 2026-11-01. State: DONE. Commit: 118bc48.

## Deliverables

| # | Deliverable | Path |
|---|---|---|
| 1 | Stack proposal v2 for Vercel, with a "Gate 1 changes" section | `api/stack-proposal.md` |
| 2 | Content model and contract 0.1.0, plus machine-readable schemas and loaders | `api/contract.md`, `api/CHANGELOG.md`, `server/contracts/schema.ts`, `server/content/*.ts` |
| 3 | First-draft copy for everything, marked draft | `server/content/` (site, 10 chapters, 6 roles, 4 gates, 8 scenes, setup, credits) |
| 4 | Vercel readiness: the CLI through npx, a local `vercel build`, no login | `api/stack-proposal.md` §5; `projects/how-it-works/vercel.json` |
| also | Slot fixtures (filled and pending), committed snapshots, a post-build checker, 14 tests | `server/contracts/fixtures/`, `server/content/generated/`, `server/scripts/`, `server/test/` |

## What Vercel changed, and how the stack handles it

Facts from Vercel's docs (quotes and URLs are in the proposal):

1. **The Root Directory is isolated.** "Your app will not be able to access files outside of that directory."
   - So the Root Directory is `projects/how-it-works`, not `web/`, and `projects/how-it-works/vercel.json` builds `web/` with `--prefix`.
   - Kit facts from above the project (the `BOOTSTRAP.md` requirements and the commit counts) come from **committed snapshots** (`server/content/generated/`), refreshed by `server/scripts/sync-kit-facts.ts`. A test fails if the requirements snapshot drifts.
2. **Builds clone 10 commits** (`--depth=10`). The paper-trail counts come from the snapshot.
3. **Hobby is "non-commercial personal use only".** A showcase of a free kit fits *(inferred)*; Pro is US$20 per seat per month if it doesn't. **This is the human's call at Gate 4.**
4. **Hobby has no required-reviewer step**, so Gate 4 runs on Deployment Protection: "All Deployments" until Gate 4, then "Standard" to go live.
5. **The first deployment of a new project is always production.** The proposal says to create the project with `vercel link`, which doesn't deploy, or only at Gate 4, and to do the Q10 history rewrite before connecting Git.
6. **A real CSP header:** `script-src 'self'; style-src 'self'`, with no third-party origins at all (Q9 means no analytics). It works because Astro is configured to emit no inline code (§1 of the proposal), and `check-dist.ts` enforces that inside the Vercel build.

## Local Vercel build: proven without an account

- **Setup:** a copy of `projects/how-it-works` with no kit above it, which is how Vercel sees it, plus a throwaway Astro 7.4.4 page using the exact `content.config.ts` from the contract.
- **Astro build:** all ten collections synced, with the snapshot fallbacks in use. `<Picture>` optimised images from outside `web/` to AVIF and WebP. That closes the version 1 Phase 4 question.
- **Inline code:** with `build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0`, the HTML had no inline script, `<style>` or `style=`. Without the second setting, Astro inlined a small module script that the header CSP would have blocked.
- **`npx vercel@65.9.0 build`:** worked with a hand-written, git-ignored `.vercel/project.json`, telemetry off and stdin closed. Exit 0. The Build Output API v3 output had the headers and trailing-slash routes. `check-dist` ran inside it and was clean.
- **`check-dist` on a broken page:** caught all five planted problems (inline script, `<style>`, `style=`, a drive path, an email).
- **Not done:** no account was created, no login, no link and no deploy. The test folder is deleted.

## Choices worth a second look

- **Chapter 1 shows the human's real prompt verbatim.** It's the story's premise, not an agent message or a gate decision, so I read Q5 as allowing it. All other dialogue and decisions are made up. The PM may want to confirm.
- **Fictional gate decisions** (gates G1 to G4) are plausible and match the story, but they aren't the real G1 answers. That's Q5 as written.
- **Content lives in `server/content/`** because it's mine for now. If Concept or the PM take over the copy after Gate 2, it can move; only the paths in `content.config.ts` change.
- **`projects/how-it-works/vercel.json`** sits at the project root, outside `server/` and `api/`. I've claimed it as deployment config (Backend's role) and told Front-end. Please add it to the ownership table if that's agreed.
- **GSAP (7cc3230)** is fine with the CSP if bundled in `web/`. If it's used, `credits.json` needs a GSAP entry.

## Front-end

- I sent the contract shape before writing any files, then an amendment covering the Vercel Root Directory, the snapshots and `vercel.json`.
- **I haven't had a reply yet.** The proposal's sign-off table says "awaiting", and the contract is versioned 0.1.0 "draft, published for Gate 3 work", so changes Front-end asks for will be MINOR or MAJOR bumps with a CHANGELOG entry.
- **Points for Front-end:**
  - add `vite.resolve.dedupe: ['zod']` and the two no-inline settings to `astro.config`;
  - set `fallbackFormat` on `<Picture>`;
  - use `CONTENT_SLOTS=filled` for the Gate 3 variations.

## Before Gate 4 (for the PM)

- Run `node projects/how-it-works/server/scripts/sync-kit-facts.ts` after the Q10 history rewrite, so the counts match the public history.
- Build with `STRICT_SLOTS=1`; it fails if Concept's art, the G3 contact sheet or Review's audit image hasn't landed.
- Flip `draft` and `site.status` once Concept's tone pass is done.
- The human's steps are listed in `api/stack-proposal.md` §3.

## Needs

Nothing to finish this brief. Front-end's acknowledgement of contract 0.1.0 is still pending.
