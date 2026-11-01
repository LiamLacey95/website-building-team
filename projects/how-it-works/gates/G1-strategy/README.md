# Gate 1: Strategy and scope (how-it-works)

**What you're deciding:** whether the strategy, the site's structure and the stack are right, and ten open questions. After this, Concept starts the three creative directions (Gate 2).

**Quick answer:** "Gate 1: accept all recommendations", or give question numbers and option letters, or "revise: …".

## The strategy in one screen

- **Positioning:** *Six AI agents, four human gates, one prompt to a launched website. This site is its own case study.*
- **Three principles** (from Research's evidence, `research/SUMMARY.md`):
  1. **Proof over claims.** Follow this site's own prompt through the team and show the real files. 84% of developers use AI tools but only 3.1% highly trust them, and no competitor shows its own process end to end.
  2. **One sentence, one diagram.** The setup sentence with a copy button is the call to action. The Double Diamond (CC BY 4.0, Design Council) with the four gates marked is the hero, the progress rail and the navigation.
  3. **Creative, not heavy.** Native scroll; CSS scroll-driven effects (in every major browser since 27 Oct 2026); a reduced-motion toggle; under 10 KB of JS. The creative budget goes on art direction and ComfyUI imagery.
- **Audience:** Maya (builds with AI agents), Tomás (studio owner weighing billable quality), Sam (just handed the repo).

## Structure

| Page | Purpose |
|---|---|
| `/` Home | The story in 10 chapters: Hero, The sentence, The studio, Discover, Define + G1, Concept + G2, Variations + G3, Build and review + G4, The receipt (git log, time), Your turn (setup) |
| `/made/` | How this site was made: every gate packet in full |
| `/setup/` | Requirements, what bootstrap does, FAQ |
| `/credits/` | Credits and licences |
| `/llms.txt`, `/story.md` | Plain-text twins for agents |

Chapters 4 to 7 share one "gate card": what you saw, the options, what you chose, what changed. Artefacts from gates that haven't happened yet are slots that fill in automatically during the build.

## Stack (Backend, signed off by Front-end)

Static **Astro 7** site with a build-time pipeline that reads this repo: briefs, research, concept images and their provenance sidecars, screenshots, gate packets, review verdicts and the git log. Built-in safeguards:
- Quotes come from the real files by heading or marker; the build fails if a source disappears.
- Images whose sidecar shows a non-commercial workflow are refused.
- A redaction scan runs on the output, and research screenshots of other sites are never published.

**GitHub Pages** via Actions, $0. The deploy waits for your approval in GitHub, so Gate 4 is enforced by the tooling. Details: `api/stack-proposal.md`.

## The ten questions

| # | Question | Recommendation | Main alternative |
|---|---|---|---|
| 1 | Product name | **A. Keep "Website Building Team"**; Concept designs a wordmark and voice | B. Name the studio (adds a naming round to G2) |
| 2 | Hosting and going public | **A. GitHub Pages; make the repo public and publish at G4** ($0) | Pages from a private repo needs a paid plan, and the site would still be public; or another host |
| 3 | How meta | **A. Fully meta**: this site's own run is the spine | B. Generic explainer with a "made by the team" strand |
| 4 | Repo licence | **A. Apache-2.0** (matches Impeccable; one LICENSE plus NOTICE) | B. MIT |
| 5 | Quote agents and your gate decisions verbatim? | **B. Yes, curated**: excerpts picked by the PM, your decisions quoted as written, machine paths, ids and personal details removed | A. Everything; C. Paraphrase only |
| 6 | Publish time and cost? | **B. Time now (already being logged); decide on cost at G4** (only you can see your usage) | A. Time and cost; C. Neither |
| 7 | No NVIDIA GPU? | **A. Document the free no-GPU path**: Concept still delivers three directions, art-directed (style tiles, CSS/SVG art, licensed stock photos) instead of generated. Optional add-on, **your call on kit scope**: B. rented cloud GPU support (about half a day of Concept's work; about $1–3 per Gate 2 round, prices from third parties) | C. API option (BFL), or "GPU required" |
| 8 | Hero line | **"This website started as one sentence. Here's everything that happened next."** Share card: "An AI design studio that shows its work." Can be left to Gate 2 | "One prompt in. A website out. Four times, you decide." |
| 9 | Analytics | **A. None at launch**; GitHub stars, clones and views | B. GoatCounter (free, cookieless) with a copy-button count |
| 10 | Research screenshots of other sites when the repo goes public | **B. Remove them from the tree before going public**; keep links and notes (they stay in git history) | C. Also rewrite history (cleanest, disruptive) |

Full options and evidence for each: `research/define/gate1-questions.md` (Q7 updated with Concept's fallback note, `.team/reports/03-concept-no-gpu-fallback.md`).

## Risks

- **The site can't launch before Gate 4.** Most of its proof comes from later gates. That's by design, and the slots keep the build green meanwhile.
- **Fully meta depends on the run going well.** If a gate needs a revise round, the site shows it: that's the honest version and part of the story.
- **The repo goes public at G4** (if Q2 = A). Review's kit audit lists anything that must be cleaned up first.

## Review

See `review.md` in this folder.
