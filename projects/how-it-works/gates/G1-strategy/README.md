# Gate 1: Strategy and scope (how-it-works)

**What you're deciding:** whether the strategy, the site's structure and the stack are right, and eleven questions. After this, Concept starts the three creative directions (Gate 2).

**How to answer:** "Gate 1: accept all recommendations", or question numbers with option letters (for example "Q7 B, Q10 C"), or "revise: …". **This packet is the authoritative list of options.** If a letter in `research/define/gate1-questions.md` differs, this file wins (Research is aligning that file).

## The strategy in one screen

- **Positioning:** *Six AI agents, four human gates, one prompt to a launched website. This site is its own case study.*
- **Three principles** (from Research's evidence, `research/SUMMARY.md`):
  1. **Proof over claims.** Follow this site's own prompt through the team and show the real files. In Stack Overflow's 2025 survey, 84% of developers use or plan to use AI tools, but only 3.1% highly trust their output; none of the competitors we studied shows its own process end to end.
  2. **One sentence, one diagram.** The setup sentence with a copy button is the call to action. The Double Diamond (Design Council, CC BY 4.0, adapted) with the four gates marked is the hero, the progress rail and the navigation.
  3. **Creative, not heavy.** Native scroll; CSS scroll-driven effects, now supported in Chrome, Safari 26+ and Firefox 159+; a reduced-motion toggle; under 10 KB of JS. The creative budget goes on art direction and ComfyUI imagery.
- **Audience:** Maya (builds with AI agents), Tomás (studio owner weighing billable quality), Sam (just handed the repo).

## Structure

| Page | Purpose |
|---|---|
| `/` Home | The story in 10 chapters: Hero, The sentence, The studio, Discover, Define + G1, Concept + G2, Variations + G3, Build and review + G4, The receipt (git log, time), Your turn (setup) |
| `/made/` | How this site was made: every gate packet in full |
| `/setup/` | Requirements, what bootstrap does, FAQ |
| `/credits/` | Credits and licences, privacy note, accessibility statement, AI-generated imagery disclosure |
| `/llms.txt`, `/story.md` | Plain-text twins for agents |

Chapters 4 to 7 share one "gate card": what you saw, the options, what you chose, what changed. Artefacts from gates that haven't happened yet are slots that fill in automatically during the build.

## Stack (Backend, signed off by Front-end)

Static **Astro 7** site with a build-time pipeline that reads this repo: briefs, research, concept images and their provenance sidecars, screenshots, gate packets, review verdicts and the git log. Built-in safeguards:
- Quotes come from the real files by heading or marker; the build fails if a source disappears.
- Images whose provenance shows a non-commercial model anywhere in their chain are refused.
- A redaction scan runs on the output, and research screenshots of other sites are never published.

**GitHub Pages** via Actions, $0. The deploy can wait for your approval in GitHub, so Gate 4 is enforced by the tooling, **but only on a public repo**: on Free, Pro and Team plans, GitHub's required-reviewer rule works on public repositories only. Under Q2 A the order is: make the repo public, set yourself as reviewer on the `github-pages` environment, and only then merge the deploy workflow. Details: `api/stack-proposal.md`.

## The eleven questions

Recommended option first. Every option has a letter; the letters are the same here and on the contact sheet.

| # | Question | Options |
|---|---|---|
| 1 | Product name | **A. Keep "Website Building Team"** (recommended); Concept designs a wordmark and voice · B. Name the studio (adds a naming round to G2) · C. Keep the name, add a short nickname for the wordmark |
| 2 | Hosting and going public | **A. GitHub Pages; make the repo public and publish at G4, $0** (recommended) · B. Keep the repo private and pay for a plan with Pages (the site is still public, and the G4 approval rule is lost) · C. Another static host (Netlify, Cloudflare Pages) |
| 3 | How meta | **A. Fully meta: this run is the spine** (recommended) · B. Generic explainer with a "made by the team" strand · C. Generic explainer only |
| 4 | Repo licence | **A. Apache-2.0** (recommended; matches Impeccable. Our NOTICE also carries Impeccable's upstream NOTICE and the two MIT notices) · B. MIT · C. Something else |
| 5 | Quote agents and your gate decisions verbatim? | A. Yes, everything · **B. Yes, curated**: excerpts picked by the PM, your decisions quoted as written, machine paths, ids and personal details removed (recommended) · C. Paraphrase only |
| 6 | Publish time and cost? | A. Time and cost · **B. Time now (already being logged); decide on cost at G4**; only you can see your usage (recommended) · C. Neither |
| 7 | No NVIDIA GPU. This sets **kit scope and what the site tells visitors**; it doesn't affect this project's imagery, because this machine has a GPU | **A. Document the free art-directed path only** (recommended): Concept still delivers three directions with style tiles, code-made art and licensed stock photos · B. A, plus rented cloud GPU support (about ½ day of Concept's work; about $1–3 per Gate 2 round, third-party prices) · C. A, plus a BFL image API adapter (about $0.01–0.04 per image, BFL terms apply, no tuned workflows) · D. State that an NVIDIA GPU is required |
| 8 | Hero line | **A. "This website started as one sentence. Here's everything that happened next."** (recommended; share card: "An AI design studio that shows its work.") · B. "One prompt in. A website out. Four times, you decide." · C. Leave it to Gate 2 |
| 9 | Analytics | **A. None at launch**; GitHub stars, clones and views (recommended) · B. GoatCounter (free for reasonable public use, cookieless) with a copy-button count · C. Conventional analytics (needs a consent banner; not recommended) |
| 10 | Research screenshots of other sites (46 files, including Nintendo, Kurzgesagt and Monument Valley art) when the repo goes public | A. Keep them · B. Delete them from the current files only (they stay downloadable from git history) · **C. At G4, rewrite this repo's history to remove them everywhere, then publish; the real commit history stays as proof** (PM recommends) · D. Publish a fresh repo with one squashed initial commit and keep this repo private as the working copy; the site's git-log chapter uses a snapshot exported before the squash (**Review recommends**: it also removes old machine paths and thread ids from public history) |
| 11 | FLUX Klein licence | **A. Confirm that your annual revenue, including affiliates, is under US$5M**: shipped images may use FLUX Klein; Review's Gate 2 visual check is the required output review, and `/credits/` carries the AI disclosure (recommended if true) · B. Not under US$5M, or unsure: shipped images use Z-Image Turbo (Apache-2.0) only, and Klein stays for concept boards |

**PM and Review differ on Q10.** I recommend C because the site's promise is "every step leaves a file you can read", and the honest history, minus the screenshots, is part of that proof. The remaining machine paths and thread ids are harmless. Review recommends D because it's the cleanest public record and the least disruptive operation: no rewriting of the repo five agents are working in. Either way, nothing goes public before Gate 4.

## Risks

- **The site can't launch before Gate 4.** Most of its proof comes from later gates. That's by design, and the slots keep the build working in the meantime.
- **Fully meta depends on the run going well.** If a gate needs a revise round, the site shows it; that's the honest version and part of the story.
- **Usage limits.** Six Opus threads in parallel hit a session limit once today (Review paused for two hours). Gates 2 and 3 are the heaviest phases; I'll stagger work.

## Review

`review.md` in this folder: REVISE on the first draft, for packet fixes only (option letters, the Klein question, Q10 options, contrast on the contact sheet). This revision addresses all three MAJOR findings and MINOR 1, 2 and 8; the rest go into Phase 3 and 4 briefs.
